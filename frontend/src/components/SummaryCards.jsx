export default function SummaryCards({ incidents }) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }

  incidents.forEach((inc) => {
    const s = (inc.severity || '').toLowerCase()
    if (counts[s] !== undefined) counts[s]++
  })

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-label">Total Incidents</div>
        <div className="summary-card-value total">{incidents.length}</div>
      </div>
      <div className="summary-card">
        <div className="summary-card-label">Critical</div>
        <div className="summary-card-value critical">{counts.critical}</div>
      </div>
      <div className="summary-card">
        <div className="summary-card-label">High</div>
        <div className="summary-card-value high">{counts.high}</div>
      </div>
      <div className="summary-card">
        <div className="summary-card-label">Medium / Low</div>
        <div className="summary-card-value medium">{counts.medium + counts.low}</div>
      </div>
    </div>
  )
}
