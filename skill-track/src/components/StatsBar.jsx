// The three numbers at the top: how many skills there are,
// how many are finished, and the average progress across all of them.
function StatsBar({ total, completed, averageProgress }) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-value">{total}</span>
        <span className="stat-label">Skills tracked</span>
      </div>
      <div className="stat">
        <span className="stat-value">{completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat">
        <span className="stat-value">{averageProgress}%</span>
        <span className="stat-label">Average progress</span>
      </div>
    </div>
  )
}

export default StatsBar
