from typing import TypedDict, List, Optional


class MediAgentState(TypedDict):
    question: str
    patient_context: Optional[str]
    retrieved_documents: Optional[List[str]]
    risk_alerts: Optional[List[str]]
    record_summary: Optional[str]
    literature_summary: Optional[str]
    final_answer: Optional[str]
    sources: Optional[List[str]]
    current_agent: Optional[str]