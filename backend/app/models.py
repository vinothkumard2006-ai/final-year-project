from __future__ import annotations

from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(80), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="VIEWER")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    ip = Column(String(45), unique=True, nullable=False, index=True)
    mac = Column(String(20), nullable=True)
    status = Column(String(20), default="ACTIVE")
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    risk_score = Column(Float, default=0.0)


class NetworkFlow(Base):
    __tablename__ = "network_flows"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    source_ip = Column(String(45), index=True)
    destination_ip = Column(String(45))
    protocol = Column(String(20))
    packet_count = Column(Integer, default=0)
    byte_count = Column(Integer, default=0)


class Threat(Base):
    __tablename__ = "threats"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    source_ip = Column(String(45), index=True)
    severity = Column(String(20), default="MEDIUM")
    description = Column(Text)
    score = Column(Float, default=0.0)


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    title = Column(String(255), nullable=False)
    severity = Column(String(20), default="MEDIUM")
    message = Column(Text)


class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    title = Column(String(255), nullable=False)
    status = Column(String(20), default="OPEN")
    severity = Column(String(20), default="MEDIUM")


class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Float, default=0.0)
    summary = Column(String(255))


class SystemSetting(Base):
    __tablename__ = "system_settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(80), unique=True, nullable=False)
    value = Column(String(255), nullable=False)
