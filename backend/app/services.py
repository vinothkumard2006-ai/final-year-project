from __future__ import annotations

import random
from typing import List, Dict


def build_demo_payload() -> dict:
    devices = [
        {"ip": "192.168.1.10", "mac": "AA:BB:CC:10", "status": "ACTIVE", "risk_score": 0.2},
        {"ip": "192.168.1.44", "mac": "AA:BB:CC:44", "status": "SUSPICIOUS", "risk_score": 0.9},
        {"ip": "192.168.1.12", "mac": "AA:BB:CC:12", "status": "ACTIVE", "risk_score": 0.5},
    ]
    flows = [
        {"source_ip": "192.168.1.10", "destination_ip": "10.0.0.15", "protocol": "TCP", "packet_count": 40, "byte_count": 1800},
        {"source_ip": "192.168.1.44", "destination_ip": "10.0.0.20", "protocol": "UDP", "packet_count": 18, "byte_count": 900},
        {"source_ip": "192.168.1.12", "destination_ip": "10.0.0.9", "protocol": "ICMP", "packet_count": 12, "byte_count": 320},
    ]
    return {"devices": devices, "flows": flows}


def generate_threats() -> List[Dict[str, object]]:
    return [
        {"source_ip": "192.168.1.44", "severity": "HIGH", "description": "Suspicious scan pattern", "score": 0.91},
        {"source_ip": "192.168.1.12", "severity": "MEDIUM", "description": "DNS tunneling suspicion", "score": 0.83},
    ]


def compute_risk() -> float:
    return round(67 + random.uniform(-5, 8), 1)
