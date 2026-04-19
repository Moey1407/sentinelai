<div align="center">

# 🛡️ SentinelAI

### AI-Powered Cybersecurity Threat Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph)

**Detect anomalies. Investigate threats. Act fast.**

[Live Demo](https://sentinelai-9k3q.onrender.com) · [API Docs](https://sentinelai-9k3q.onrender.com/docs) · [Report a Bug](https://github.com/Moey1407/sentinelai/issues)

</div>

---

## What is SentinelAI?

SentinelAI is a full-stack threat intelligence platform that combines **unsupervised machine learning** with an **autonomous AI agent** to detect, investigate, and report on network anomalies in real time.

Paste raw network logs → ML flags anomalies → an AI agent cross-references live threat databases → structured incident reports are generated and stored automatically.

No rules. No signatures. Just intelligence.

---

## Features

| Feature | Description |
|---|---|
| **ML Anomaly Detection** | Isolation Forest trained on 5 network features — detects outliers without labeled data |
| **AI Agent Investigation** | LangGraph ReAct agent autonomously calls VirusTotal + AbuseIPDB APIs to assess threat level |
| **Incident Reports** | Structured reports with severity rating, summary, and remediation recommendations — auto-saved to database |
| **Auth** | Supabase-powered signup/login with JWT session management |
| **Live Dashboard** | Real-time incident history with severity breakdown and scan statistics |
| **REST API** | Fully documented FastAPI backend with interactive Swagger UI |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│         Login → Dashboard → Scan → Report           │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────────┐
│                  FastAPI Backend                     │
│                                                     │
│  ┌─────────────┐   ┌─────────────────────────────┐  │
│  │   /analyze  │   │       /agent/investigate     │  │
│  │             │   │                             │  │
│  │  Isolation  │   │   LangGraph ReAct Agent     │  │
│  │   Forest    │   │   ┌───────────────────────┐ │  │
│  │ + Standard  │   │   │ check_virustotal()    │ │  │
│  │   Scaler    │   │   │ check_abuseipdb()     │ │  │
│  └─────────────┘   │   │ write_incident_report()│ │  │
│                    │   └───────────────────────┘ │  │
│                    └─────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    Supabase                          │
│            Auth · Incidents Table · RLS             │
└─────────────────────────────────────────────────────┘
```

---

## How the ML Works

The anomaly detector uses **Isolation Forest** — an unsupervised algorithm that isolates outliers by randomly partitioning data. Anomalies require fewer splits to isolate, producing a lower anomaly score.

Five features are extracted from each log line:

| Feature | Why it matters |
|---|---|
| `request_frequency` | High freq from one IP = potential brute force or DDoS |
| `port` | Unusual ports (e.g. 4444, 31337) indicate C2 or backdoors |
| `bytes` | Abnormally large payloads suggest data exfiltration |
| `protocol` | Rare protocol usage can indicate tunneling |
| `hour_of_day` | 3am traffic from internal IPs is inherently suspicious |

A **StandardScaler** normalises all features before prediction, ensuring port numbers (0–65535) don't dominate byte values (0–512,000).

---

## How the AI Agent Works

The investigator uses **LangGraph's ReAct pattern** (Reason → Act → Observe loop):

```
User: Investigate 185.220.101.45
  └─▶ Agent thinks: "I should check this IP for threat intel"
        └─▶ Calls check_virustotal("185.220.101.45")
              └─▶ Observes: "14 malicious detections"
                    └─▶ Calls check_abuseipdb("185.220.101.45")
                          └─▶ Observes: "abuse score 100/100, 847 reports"
                                └─▶ Calls write_incident_report(..., severity="critical")
                                      └─▶ Saved to Supabase ✓
```

The agent decides **autonomously** which tools to call, in what order, and when it has enough information to write the final report.

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Supabase](https://supabase.com) project
- API keys for [Anthropic](https://console.anthropic.com), [VirusTotal](https://virustotal.com), and [AbuseIPDB](https://abuseipdb.com)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:

```env
ANTHROPIC_API_KEY=your_key
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_anon_key
```

Run the server:

```bash
uvicorn main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Run the dev server:

```bash
npm run dev
```

### Supabase Table

Run this in the Supabase SQL Editor:

```sql
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_ip TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  summary TEXT,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON incidents FOR ALL USING (true) WITH CHECK (true);
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/auth/signup` | Create account |
| `POST` | `/auth/login` | Login |
| `POST` | `/analyze` | Run ML anomaly detection on log lines |
| `POST` | `/agent/investigate` | AI agent investigates an anomaly |
| `GET` | `/incidents` | Fetch all saved incidents |

Full interactive docs: [`/docs`](https://sentinelai-9k3q.onrender.com/docs)

---

## Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com) — async Python API framework
- [scikit-learn](https://scikit-learn.org) — Isolation Forest anomaly detection
- [LangGraph](https://langchain-ai.github.io/langgraph) — autonomous AI agent framework
- [Claude Sonnet](https://anthropic.com) — LLM powering the investigation agent
- [Supabase](https://supabase.com) — Postgres database + auth

**Frontend**
- [React](https://reactjs.org) + [Vite](https://vitejs.dev) — fast, modern UI
- Plain CSS dark theme — no component library dependencies

**Threat Intelligence APIs**
- [VirusTotal](https://virustotal.com) — malware and IP reputation
- [AbuseIPDB](https://abuseipdb.com) — IP abuse reports database

---

## Project Structure

```
sentinelai/
├── backend/
│   ├── agent/
│   │   └── investigator.py     # LangGraph ReAct agent + tools
│   ├── db/
│   │   └── supabase_client.py  # DB client + save_incident helper
│   ├── ml/
│   │   └── model.py            # IsolationForest + StandardScaler
│   ├── routers/
│   │   ├── analyze.py          # POST /analyze
│   │   ├── agent.py            # POST /agent/investigate
│   │   ├── incidents.py        # GET /incidents
│   │   └── auth.py             # POST /auth/login + signup
│   ├── main.py                 # FastAPI app + CORS + router registration
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/index.js        # Fetch wrappers for all endpoints
        ├── components/         # ScanPanel, IncidentCard, SummaryCards
        ├── pages/              # Login, Dashboard
        └── styles/globals.css  # Dark theme
```

---

## Security Notes

- All API keys are stored as environment variables — never committed to source control
- Supabase Row Level Security (RLS) is enabled on the incidents table
- CORS is configured to allow only the deployed frontend origin in production

---

<div align="center">

Built by [Muhammed](https://github.com/Moey1407) · Powered by Claude + LangGraph + scikit-learn

</div>
