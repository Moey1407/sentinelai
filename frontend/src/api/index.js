const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export const signup = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Signup failed')
  return res.json()
}

export const analyzeLogs = async (logs) => {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(logs),
  })
  if (!res.ok) throw new Error('Analysis failed')
  return res.json()
}

export const investigate = async (anomaly) => {
  const res = await fetch(`${API_BASE}/agent/investigate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(anomaly),
  })
  if (!res.ok) throw new Error('Investigation failed')
  return res.json()
}

export const getIncidents = async () => {
  const res = await fetch(`${API_BASE}/incidents`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Failed to fetch incidents')
  return res.json()
}
