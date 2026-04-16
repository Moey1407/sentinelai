from fastapi import APIRouter
from agent.investigator import investigate

router = APIRouter()

@router.post("/agent/investigate")
def agent_investigate(anomaly: dict):
    result = investigate(anomaly)
    return {"report": result}