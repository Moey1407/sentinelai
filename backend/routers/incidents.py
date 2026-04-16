from db.supabase_client import supabase
from fastapi import APIRouter

router = APIRouter()

@router.get("/incidents")
def get_incidents():
    return supabase.table("incidents").select("*").execute().data