import os
from dotenv import load_dotenv
from supabase import create_client


load_dotenv()

url = os.getenv("https://xehigkygqowiueywzunl.supabase.co")
key = os.getenv("sb_publishable_8PGP8P6hcMvLCjOYh7zu0g_DGj0vCJX")

supabase = create_client(url, key)