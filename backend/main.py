
#easiest way ive found to create an API, using java is a madhir
from fastapi import FastAPI

#from claude: "CORS controls which domains are allowed to make requests to your API. Without it, your React app on port 5173 would be blocked from talking to your FastAPI on port 8000 by the browser's security rules.""
from fastapi.middleware.cors import CORSMiddleware

#loads a .env file
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SentinelAI")


#like claude said, we did the shit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#from claude (cause this step is confusing and apparently is not necessary - but helps to check the server is running properly):
#'@app.get("/") is a decorator — it registers the function below it as a route. It tells FastAPI "when someone makes a GET request to /, run this function."'
@app.get("/")
def health_check():
    return {"status": "ok"}

# from backend.routers import analyze, agent, incidents, auth
# app.include_router(analyze.router)
# app.include_router(agent.router)
# app.include_router(incidents.router)
# app.include_router(auth.router)

if __name__ == "__main__":
    #essentialy use uvicorn to 'turn on web app'
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)