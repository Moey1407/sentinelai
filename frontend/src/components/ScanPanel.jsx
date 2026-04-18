import { useState } from 'react'
import { analyzeLogs, investigate } from '../api'
import SeverityBadge from './SeverityBadge'

const SAMPLE_LOGS = `2024-01-15T03:22:11 192.168.1.105 22 TCP 84200
2024-01-15T09:15:00 192.168.1.106 80 TCP 1200
2024-01-15T03:22:12 192.168.1.105 22 TCP 84200
2024-01-15T03:22:13 192.168.1.105 22 TCP 84200`

export default function ScanPanel({ onNewIncident }) {
  const [logs, setLogs] = useState('')
  const [scanning, setScanning] = useState(false)
  const [anomalies, setAnomalies] = useState([])
  const [scanError, setScanError] = useState(null)
  const [investigatingIdx, setInvestigatingIdx] = useState(null)
  const [reports, setReports] = useState({})

  const handleScan = async () => {
    const lines = logs.trim().split('\n').filter(Boolean)
    if (!lines.length) return

    setScanning(true)
    setScanError(null)
    setAnomalies([])
    setReports({})

    try {
      const data = await analyzeLogs(lines)
      setAnomalies(data.anomalies || [])
    } catch (e) {
      setScanError(e.message)
    } finally {
      setScanning(false)
    }
  }

  const handleInvestigate = async (anomaly, idx) => {
    setInvestigatingIdx(idx)
    try {
      const data = await investigate(anomaly)
      setReports((prev) => ({ ...prev, [idx]: data.report }))
      if (onNewIncident) onNewIncident()
    } catch (e) {
      setReports((prev) => ({ ...prev, [idx]: `Error: ${e.message}` }))
    } finally {
      setInvestigatingIdx(null)
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Log Scanner</span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setLogs(SAMPLE_LOGS)}
        >
          Load Sample
        </button>
      </div>
      <div className="panel-body">
        <div className="scan-form">
          <div className="form-group">
            <label className="form-label">Paste log lines</label>
            <textarea
              className="form-input"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder="TIMESTAMP IP PORT PROTOCOL BYTES"
              rows={6}
            />
            <span className="scan-hint">
              Format: 2024-01-15T03:22:11 192.168.1.105 22 TCP 84200
            </span>
          </div>
          <button
            className="btn btn-primary btn-full"
            onClick={handleScan}
            disabled={scanning || !logs.trim()}
          >
            {scanning ? (
              <>
                <span className="spinner" />
                Scanning...
              </>
            ) : (
              'Scan for Anomalies'
            )}
          </button>
        </div>

        {scanError && <div className="error-banner" style={{ marginTop: 16 }}>{scanError}</div>}

        {anomalies.length > 0 && (
          <div className="scan-results">
            <div className="scan-results-title">
              {anomalies.length} anomal{anomalies.length === 1 ? 'y' : 'ies'} detected
            </div>

            {anomalies.map((anomaly, idx) => (
              <div className="anomaly-card" key={idx}>
                <div className="anomaly-header">
                  <span className="anomaly-ip">{anomaly.source_ip}</span>
                  {!reports[idx] && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleInvestigate(anomaly, idx)}
                      disabled={investigatingIdx === idx}
                    >
                      {investigatingIdx === idx ? (
                        <>
                          <span className="spinner" />
                          Investigating...
                        </>
                      ) : (
                        'Investigate with AI'
                      )}
                    </button>
                  )}
                </div>

                <div className="anomaly-meta">
                  <span>
                    <span className="meta-label">Port </span>
                    {anomaly.port}
                  </span>
                  <span>
                    <span className="meta-label">Protocol </span>
                    {anomaly.protocol}
                  </span>
                  <span>
                    <span className="meta-label">Bytes </span>
                    {anomaly.bytes?.toLocaleString()}
                  </span>
                  <span>
                    <span className="meta-label">Time </span>
                    {anomaly.timestamp}
                  </span>
                </div>

                {reports[idx] && (
                  <div className="agent-report">
                    <div className="agent-report-label">AI Investigation Report</div>
                    <div className="agent-report-content">{reports[idx]}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!scanning && anomalies.length === 0 && logs && (
          <div className="empty-state" style={{ paddingTop: 24 }}>
            No anomalies detected in the provided logs.
          </div>
        )}
      </div>
    </div>
  )
}
