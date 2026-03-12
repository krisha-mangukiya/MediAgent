from sqlalchemy.orm import Session
from backend.database.models import Patient, DiagnosisHistory, MedicalDocument


def create_patient(db: Session, name: str, age: int, gender: str,
                   condition: str, medications: str, allergies: str,
                   blood_pressure: str, notes: str = ""):
    patient = Patient(
        name=name, age=age, gender=gender,
        condition=condition, medications=medications,
        allergies=allergies, blood_pressure=blood_pressure,
        notes=notes
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def get_all_patients(db: Session):
    return db.query(Patient).order_by(Patient.created_at.desc()).all()


def get_patient(db: Session, patient_id: int):
    return db.query(Patient).filter(Patient.id == patient_id).first()


def save_diagnosis(db: Session, question: str, patient_context: str,
                   final_answer: str, record_summary: str,
                   literature_summary: str, risk_alerts: list,
                   sources: list, patient_id: int = None):
    diagnosis = DiagnosisHistory(
        patient_id=patient_id,
        question=question,
        patient_context=patient_context,
        final_answer=final_answer,
        record_summary=record_summary,
        literature_summary=literature_summary,
        risk_alerts=risk_alerts,
        sources=sources
    )
    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)
    return diagnosis


def get_diagnosis_history(db: Session, limit: int = 20):
    return db.query(DiagnosisHistory).order_by(
        DiagnosisHistory.created_at.desc()
    ).limit(limit).all()


def save_document(db: Session, filename: str, file_path: str, chunks_count: int):
    doc = MedicalDocument(
        filename=filename,
        file_path=file_path,
        chunks_count=chunks_count
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def get_all_documents(db: Session):
    return db.query(MedicalDocument).order_by(
        MedicalDocument.created_at.desc()
    ).all()