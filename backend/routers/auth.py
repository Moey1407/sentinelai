from pydantic import BaseModel
from fastapi import APIRouter
from db.supabase_client import supabase

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str
    
    
@router.post("/auth/signup")
def signup(body: AuthRequest):
    return supabase.auth.sign_up({"email": body.email, "password": body.password})

@router.post("/auth/login")
def login(body: AuthRequest):
    return supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})


