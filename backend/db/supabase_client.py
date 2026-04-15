import os

#apparently this shit below reads the .env into the envinoment
#which is helpful cause before thi the key and url was hardcoded
#and now its more secure cause we dont push a .env
from dotenv import load_dotenv

#supabase python client
from supabase import create_client

#loads the .env file before any env variables are read
load_dotenv()

#based off above, we were stupid but now we good, values get taken from the .env file
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")


#client instance
supabase = create_client(url, key)


#insert this stuff into the database
def save_incident(data):
    result = supabase.table("incidents").insert(data).execute()
    return result
    