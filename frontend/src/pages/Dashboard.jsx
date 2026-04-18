import { useState, useEffect, useCallback } from 'react'
import { getIncidents } from '../api'
import SummaryCards from '../components/SummaryCards'
import ScanPanel from '../components/ScanPanel'
import IncidentCard from '../components/IncidentCard'

export default function Dashboard({ onLogout }) {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await getIncidents()
      setIncidents(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  return (
    <>
      <header className="header">
        <div className="header-brand">
          <div className="header-brand-icon">S</div>
          <div className="header-brand-name">
            Sentinel<span>AI</span>
          </div>
        </div>
        <div className="header-right">
          <div className="header-status">
            <span className="status-dot" />
            System Online
          </div>
          <button className="btn btn-danger btn-sm" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="dashboard">
        <SummaryCards incidents={incidents} />

        <div className="dashboard-grid">
          <ScanPanel onNewIncident={fetchIncidents} />

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Incident History</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={fetchIncidents}
              >
                Refresh
              </button>
            </div>
            <div className="panel-body" style={{ padding: '12px' }}>
              {loading && (
                <div className="loading-row">
                  <span className="spinner" />
                  Loading incidents...
                </div>
              )}
              {error && <div className="error-banner">{error}</div>}
              {!loading && !error && incidents.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🛡</div>
                  No incidents recorded yet.
                  <br />
                  Run a scan to generate reports.
                </div>
              )}
              {!loading && incidents.length > 0 && (
                <div className="incidents-list">
                  {incidents
                    .slice()
                    .reverse()
                    .map((inc) => (
                      <IncidentCard key={inc.id} incident={inc} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
