#shit ton of imports coming up, but we need them all for the agent
import os
from dotenv import load_dotenv

#below is the claude model
from langchain_anthropic import ChatAnthropic

#below (from claude): builds the LangGraph agent loop automatically (ReAct = Reason + Act, the pattern of think → tool → think → tool → answer)
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from db.supabase_client import save_incident


load_dotenv()

llm = ChatAnthropic(
    model="claude-sonnet-4-5",
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

@tool
def check_virustotal(ip: str):
    """Check an IP address against VirusTotal for threat intelligence."""
    
    api_key = os.getenv("VIRUSTOTAL_API_KEY")
    import httpx
    response = httpx.get(
        f"https://www.virustotal.com/api/v3/ip_addresses/{ip}",
        headers={"x-apikey": api_key}
    )
    if response.status_code != 200:
        return f"VirusTotal: could not retrieve data for {ip}"
    data = response.json()
    stats = data["data"]["attributes"]["last_analysis_stats"]
    malicious = stats.get("malicious", 0)
    suspicious = stats.get("suspicious", 0)
    return f"VirusTotal result for {ip}: {malicious} malicious, {suspicious} suspicious detections"
    
    return f"VirusTotal result for {ip}: No malicious activity detected"

@tool
def check_abuseipdb(ip: str) -> str:
    """Check an IP address against AbuseIPDB for abuse reports."""
    api_key = os.getenv("ABUSEIPDB_API_KEY")
    import httpx
    response = httpx.get(
        "https://api.abuseipdb.com/api/v2/check",
        headers={"Key": api_key, "Accept": "application/json"},
        params={"ipAddress": ip, "maxAgeInDays": 90}
    )
    if response.status_code != 200:
        return f"AbuseIPDB: could not retrieve data for {ip}"
    data = response.json()["data"]
    score = data["abuseConfidenceScore"]
    reports = data["totalReports"]
    country = data.get("countryCode", "unknown")
    return f"AbuseIPDB result for {ip}: abuse score {score}/100, {reports} reports, country {country}"

@tool
def write_incident_report(source_ip: str, severity: str, summary: str, recommendations: str) -> str:
    """Write a structured incident report with source IP, severity, summary and recommendations."""
    save_incident({
        "source_ip": source_ip,
        "severity": severity.lower(),
        "summary": summary,
        "recommendations": recommendations,
    })
    return f"Incident report saved for {source_ip}: severity={severity}"


tools = [check_virustotal, check_abuseipdb, write_incident_report]

agent = create_react_agent(llm, tools)

def investigate(anomaly: dict) -> str:
    system_prompt = "You are a cybersecurity analyst. You will be given a network anomaly. Investigate the source IP using available tools, assess the threat level, and write a structured incident report. Be concise and precise."
    
    user_message = f"Investigate this anomaly: {anomaly}. The source IP is {anomaly.get('source_ip', 'unknown')}. Make sure to include this IP when calling write_incident_report."
    
    result = agent.invoke({
        "messages": [
            ("system", system_prompt),
            ("human", user_message)
        ]
    })
    
    return result["messages"][-1].content





