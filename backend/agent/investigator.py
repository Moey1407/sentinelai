#shit ton of imports coming up, but we need them all for the agent
import os
from dotenv import load_dotenv

#below is the claude model
from langchain_anthropic import ChatAnthropic

#below (from claude): builds the LangGraph agent loop automatically (ReAct = Reason + Act, the pattern of think → tool → think → tool → answer)
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool


load_dotenv()

llm = ChatAnthropic(
    model="claude-sonnet-4-5",
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

@tool
def check_virustotal(ip: str):
    """Check an IP address against VirusTotal for threat intelligence."""
    return f"VirusTotal result for {ip}: No malicious activity detected"

@tool
def check_abuseipdb(ip: str):
    """Check an IP address against AbuseIPDB for abuse reports."""
    return f"AbuseIPDB result for {ip}: No abuse reports found"

@tool
def write_incident_report(severity: str, summary: str, recommendations: str) -> str:
    """Write a structured incident report with severity, summary and recommendations."""
    return f"Incident report saved: severity={severity}"


tools = [check_virustotal, check_abuseipdb, write_incident_report]

agent = create_react_agent(llm, tools)

def investigate(anomaly: dict) -> str:
    system_prompt = "You are a cybersecurity analyst. You will be given a network anomaly. Investigate the source IP using available tools, assess the threat level, and write a structured incident report. Be concise and precise."
    
    user_message = f"Investigate this anomaly: {anomaly}"
    
    result = agent.invoke({
        "messages": [
            ("system", system_prompt),
            ("human", user_message)
        ]
    })
    
    return result["messages"][-1].content





