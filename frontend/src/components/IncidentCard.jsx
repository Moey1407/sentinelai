import { useState } from 'react'
import SeverityBadge from './SeverityBadge'

export default function IncidentCard({ incident }) {
  const [open, setOpen] = useState(false)

  const time = incident.created_at
    ? new Date(incident.created_at).toLocaleString()
    : '—'

  return (
    <div className="incident-card">
      <div className="incident-card-header" onClick={() => setOpen(!open)}>
        <div className="incident-card-left">
          <SeverityBadge severity={incident.severity} />
          <div>
            <div className="incident-ip">{incident.source_ip || '—'}</div>
            <div className="incident-time">{time}</div>
          </div>
        </div>
        <span className={`incident-expand ${open ? 'open' : ''}`}>▾</span>
      </div>

      {open && (
        <div className="incident-card-body">
          {incident.summary && (
            <div>
              <div className="incident-field-label">Summary</div>
              <div className="incident-field-value">{incident.summary}</div>
            </div>
          )}
          {incident.recommendations && (
            <div>
              <div className="incident-field-label">Recommendations</div>
              <div className="incident-field-value">{incident.recommendations}</div>
            </div>
          )}
          {incident.agent_reasoning && (
            <div>
              <div className="incident-field-label">Agent Reasoning</div>
              <div className="incident-field-value" style={{ fontFamily: 'Courier New, monospace', fontSize: '12px' }}>
                {incident.agent_reasoning}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
