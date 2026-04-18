export default function SeverityBadge({ severity }) {
  const level = (severity || 'unknown').toLowerCase()
  return (
    <span className={`severity-badge ${level}`}>
      {level}
    </span>
  )
}
