from langgraph.graph import StateGraph, END
from backend.agents.state import MediAgentState
from backend.agents.record_agent import record_agent
from backend.agents.literature_agent import literature_agent
from backend.agents.risk_agent import risk_agent
from backend.agents.supervisor_agent import supervisor_agent


def build_mediagent_graph():
    graph = StateGraph(MediAgentState)

    graph.add_node("record_agent", record_agent)
    graph.add_node("literature_agent", literature_agent)
    graph.add_node("risk_agent", risk_agent)
    graph.add_node("supervisor_agent", supervisor_agent)

    graph.set_entry_point("record_agent")
    graph.add_edge("record_agent", "literature_agent")
    graph.add_edge("literature_agent", "risk_agent")
    graph.add_edge("risk_agent", "supervisor_agent")
    graph.add_edge("supervisor_agent", END)

    return graph.compile()


def run_mediagent(question: str, patient_context: str = "") -> dict:
    graph = build_mediagent_graph()

    initial_state: MediAgentState = {
        "question": question,
        "patient_context": patient_context,
        "retrieved_documents": None,
        "risk_alerts": None,
        "record_summary": None,
        "literature_summary": None,
        "final_answer": None,
        "sources": None,
        "current_agent": None
    }

    print("\n--- MediAgent Multi-Agent Pipeline Started ---")
    final_state = graph.invoke(initial_state)
    print("--- MediAgent Pipeline Complete ---\n")

    return {
        "question": final_state["question"],
        "final_answer": final_state["final_answer"],
        "sources": final_state.get("sources", []),
        "record_summary": final_state.get("record_summary", ""),
        "literature_summary": final_state.get("literature_summary", ""),
        "risk_alerts": final_state.get("risk_alerts", [])
    }