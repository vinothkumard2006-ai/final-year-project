from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.models import User, Device, NetworkFlow, Threat, Alert, Incident, RiskScore, SystemSetting
from app.security import hash_password, verify_password
from app.services import build_demo_payload, generate_threats, compute_risk
import asyncio
import random
import json
from datetime import datetime, timedelta

api_router = APIRouter(prefix="/api")

# WebSocket connection set for live updates
active_connections: set[WebSocket] = set()
# will be set during startup to the running event loop so sync handlers can
# schedule coroutines safely from threadpool worker threads.
event_loop = None


async def broadcast_event(message: dict) -> None:
    dead = []
    text = json.dumps(message)
    for ws in list(active_connections):
        try:
            await ws.send_text(text)
        except Exception:
            dead.append(ws)
    for d in dead:
        active_connections.discard(d)


def _create_random_alert(db: Session) -> dict:
    templates = [
        {
            "title": "Suspicious scan detected",
            "severity": "HIGH",
            "message": "Unexpected scanning activity observed from an internal host.",
        },
        {
            "title": "Unauthorized login attempt",
            "severity": "MEDIUM",
            "message": "Multiple failed authentications were detected on the VPN gateway.",
        },
        {
            "title": "Malware signature matched",
            "severity": "HIGH",
            "message": "A high-risk signature was matched on a file transfer stream.",
        },
    ]
    alert_data = random.choice(templates)
    alert = Alert(**alert_data)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return {"id": alert.id, "title": alert.title, "severity": alert.severity, "message": alert.message}


def _create_random_incident(db: Session) -> dict:
    templates = [
        {"title": "Lateral movement", "severity": "HIGH", "status": "OPEN"},
        {"title": "Data exfiltration attempt", "severity": "HIGH", "status": "OPEN"},
        {"title": "Credential harvesting", "severity": "MEDIUM", "status": "OPEN"},
    ]
    incident_data = random.choice(templates)
    incident = Incident(**incident_data)
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return {"id": incident.id, "title": incident.title, "severity": incident.severity, "status": incident.status}


def _create_random_threat(db: Session) -> dict:
    templates = [
        {
            "source_ip": f"192.168.1.{random.randint(2,254)}",
            "severity": "HIGH",
            "description": "Brute force attack pattern detected",
            "score": round(random.uniform(0.8, 0.99), 2),
        },
        {
            "source_ip": f"192.168.1.{random.randint(2,254)}",
            "severity": "MEDIUM",
            "description": "Suspicious port scan from an internal segment",
            "score": round(random.uniform(0.6, 0.82), 2),
        },
    ]
    threat_data = random.choice(templates)
    threat = Threat(**threat_data)
    db.add(threat)
    db.commit()
    db.refresh(threat)
    return {"id": threat.id, "source_ip": threat.source_ip, "severity": threat.severity, "description": threat.description, "score": threat.score}


async def _event_generator_task() -> None:
    # Periodically generate synthetic flow and security events for live demo
    counter = 0
    while True:
        await asyncio.sleep(3)
        db = SessionLocal()
        try:
            flow = {
                "source_ip": f"192.168.1.{random.randint(2,254)}",
                "destination_ip": f"10.0.0.{random.randint(2,254)}",
                "protocol": random.choice(["TCP", "UDP", "ICMP"]),
                "packet_count": random.randint(1,500),
                "byte_count": random.randint(64,15000),
            }
            _persist_flow(flow)
            await broadcast_event({"type": "flow", "flow": flow})

            if counter % 4 == 0:
                alert = _create_random_alert(db)
                await broadcast_event({"type": "alert", "alert": alert})

            if counter % 6 == 0:
                incident = _create_random_incident(db)
                await broadcast_event({"type": "incident", "incident": incident})

            if counter % 5 == 0:
                threat = _create_random_threat(db)
                await broadcast_event({"type": "threat", "threat": threat})

            counter += 1
        finally:
            db.close()


def _persist_flow(flow: dict) -> None:
    db = SessionLocal()
    try:
        db.add(NetworkFlow(
            source_ip=flow["source_ip"],
            destination_ip=flow["destination_ip"],
            protocol=flow["protocol"],
            packet_count=flow["packet_count"],
            byte_count=flow["byte_count"],
        ))
        db.commit()
    finally:
        db.close()


async def persist_flow(flow: dict) -> None:
    await asyncio.to_thread(_persist_flow, flow)


def compute_bandwidth_usage(db: Session) -> int:
    cutoff = datetime.utcnow() - timedelta(seconds=60)
    total_bytes = db.query(func.sum(NetworkFlow.byte_count)).filter(NetworkFlow.timestamp >= cutoff).scalar() or 0
    if total_bytes <= 0:
        return 0
    return max(1, int((total_bytes * 8) / (60 * 1_000_000)))


def start_event_generator(app) -> None:
    try:
        global event_loop
        loop = asyncio.get_event_loop()
        event_loop = loop
        loop.create_task(_event_generator_task())
    except RuntimeError:
        # If no loop is running yet, schedule when app starts
        async def _startup_schedule():
            asyncio.create_task(_event_generator_task())

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        event_loop = loop
        loop.create_task(_event_generator_task())


@api_router.post("/auth/login")
def login(payload: dict, db: Session = Depends(get_db)) -> dict:
    username = payload.get("username", "")
    password = payload.get("password", "")
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": f"demo-token-{user.username}", "role": user.role}


@api_router.get("/seed")
def seed(db: Session = Depends(get_db)) -> dict:
    if db.query(User).count() == 0:
        db.add(User(username="admin", password_hash=hash_password("admin123"), role="ADMIN"))
        db.add(User(username="analyst", password_hash=hash_password("analyst123"), role="ANALYST"))
        db.add(User(username="viewer", password_hash=hash_password("viewer123"), role="VIEWER"))
    if db.query(Device).count() == 0:
        for item in build_demo_payload()["devices"]:
            db.add(Device(ip=item["ip"], mac=item["mac"], status=item["status"], risk_score=item["risk_score"]))
    if db.query(NetworkFlow).count() == 0:
        for item in build_demo_payload()["flows"]:
            db.add(NetworkFlow(source_ip=item["source_ip"], destination_ip=item["destination_ip"], protocol=item["protocol"], packet_count=item["packet_count"], byte_count=item["byte_count"]))
    if db.query(Threat).count() == 0:
        for threat in generate_threats():
            db.add(Threat(source_ip=threat["source_ip"], severity=threat["severity"], description=threat["description"], score=threat["score"]))
    if db.query(Alert).count() == 0:
        sample_alerts = [
            {"title": "Suspicious scan detected", "severity": "HIGH", "message": "Unusual scan pattern detected in the core segment."},
            {"title": "Unauthorized login attempt", "severity": "MEDIUM", "message": "Multiple failed logins were seen from a remote host."},
            {"title": "Malware signature matched", "severity": "HIGH", "message": "A high-risk signature was matched on a file transfer stream."},
        ]
        for alert in sample_alerts:
            db.add(Alert(**alert))
    if db.query(Incident).count() == 0:
        sample_incidents = [
            {"title": "Lateral movement", "severity": "HIGH", "status": "OPEN"},
            {"title": "Data exfiltration attempt", "severity": "HIGH", "status": "OPEN"},
            {"title": "Credential harvesting", "severity": "MEDIUM", "status": "OPEN"},
        ]
        for incident in sample_incidents:
            db.add(Incident(**incident))
    if db.query(RiskScore).count() == 0:
        db.add(RiskScore(score=compute_risk(), summary="Elevated"))
    if db.query(SystemSetting).count() == 0:
        db.add(SystemSetting(key="retention_days", value="2"))
        db.add(SystemSetting(key="demo_mode", value="true"))
    db.commit()
    return {"ok": True}


@api_router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)) -> dict:
    return {
        "network_health": 94,
        "active_devices": db.query(Device).count(),
        "active_threats": db.query(Threat).count(),
        "bandwidth_usage": compute_bandwidth_usage(db),
        "risk_score": compute_risk(),
    }


@api_router.get("/company")
def company_summary(db: Session = Depends(get_db)) -> dict:
    return {
        "company_name": "Northstar Labs",
        "industry": "Fintech Infrastructure & Cybersecurity",
        "location": "Austin, Texas",
        "coverage": "24/7 Global Edge Network",
        "uptime": "99.98% uptime",
        "alerts": db.query(Alert).count(),
        "status": "Monitoring healthy",
        "network_health": 94,
        "active_devices": db.query(Device).count(),
        "active_threats": db.query(Threat).count(),
        "risk_score": compute_risk(),
    }


@api_router.get("/devices")
def get_devices(db: Session = Depends(get_db)) -> list[dict]:
    return [{"id": dev.id, "ip": dev.ip, "mac": dev.mac, "status": dev.status, "risk_score": dev.risk_score} for dev in db.query(Device).all()]


@api_router.post("/devices")
def create_device(payload: dict, db: Session = Depends(get_db)) -> dict:
    ip = payload.get("ip")
    mac = payload.get("mac")
    status = payload.get("status", "ACTIVE")
    if not ip:
        raise HTTPException(status_code=400, detail="ip is required")
    if db.query(Device).filter(Device.ip == ip).first():
        raise HTTPException(status_code=409, detail="device exists")
    dev = Device(ip=ip, mac=mac, status=status)
    db.add(dev)
    db.commit()
    db.refresh(dev)
    # broadcast to websocket clients from sync request thread
    try:
        if event_loop is not None:
            # schedule safely from worker thread into the main event loop
            asyncio.run_coroutine_threadsafe(
                broadcast_event({"type": "device_added", "device": {"id": dev.id, "ip": dev.ip, "mac": dev.mac, "status": dev.status, "risk_score": dev.risk_score}}),
                event_loop,
            )
        else:
            # best-effort: try to create a task on the current loop
            asyncio.create_task(broadcast_event({"type": "device_added", "device": {"id": dev.id, "ip": dev.ip, "mac": dev.mac, "status": dev.status, "risk_score": dev.risk_score}}))
    except Exception:
        # non-fatal: don't let broadcasting break device creation
        pass
    return {"id": dev.id, "ip": dev.ip, "mac": dev.mac, "status": dev.status, "risk_score": dev.risk_score}


@api_router.get("/network-health")
def network_health(db: Session = Depends(get_db)) -> dict:
    # return simple computed metrics
    return {
        "network_health": 100 - int(compute_risk()),
        "active_devices": db.query(Device).count(),
        "active_threats": db.query(Threat).count(),
        "risk_score": compute_risk(),
    }


@api_router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            # keep connection alive; clients can send pings
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.discard(websocket)


@api_router.get("/threats")
def get_threats(db: Session = Depends(get_db)) -> list[dict]:
    return [{"id": th.id, "source_ip": th.source_ip, "severity": th.severity, "description": th.description, "score": th.score} for th in db.query(Threat).all()]


@api_router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)) -> list[dict]:
    return [{"id": alert.id, "title": alert.title, "severity": alert.severity, "message": alert.message} for alert in db.query(Alert).all()]


@api_router.get("/incidents")
def get_incidents(db: Session = Depends(get_db)) -> list[dict]:
    return [{"id": incident.id, "title": incident.title, "severity": incident.severity, "status": incident.status} for incident in db.query(Incident).all()]


@api_router.get("/flows")
def get_flows(db: Session = Depends(get_db)) -> list[dict]:
    return [{"source_ip": flow.source_ip, "destination_ip": flow.destination_ip, "protocol": flow.protocol, "packet_count": flow.packet_count, "byte_count": flow.byte_count} for flow in db.query(NetworkFlow).order_by(NetworkFlow.timestamp.desc()).limit(10).all()]
