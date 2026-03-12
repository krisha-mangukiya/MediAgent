from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    condition = Column(String(200))
    medications = Column(Text)
    allergies = Column(Text)
    blood_pressure = Column(String(20))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class DiagnosisHistory(Base):
    __tablename__ = "diagnosis_history"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=True)
    question = Column(Text, nullable=False)
    patient_context = Column(Text)
    final_answer = Column(Text)
    record_summary = Column(Text)
    literature_summary = Column(Text)
    risk_alerts = Column(JSON)
    sources = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(200), nullable=False)
    file_path = Column(String(500))
    chunks_count = Column(Integer)
    status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())