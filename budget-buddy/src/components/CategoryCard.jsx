import { formatRs, useBudget } from '../context/BudgetContext.jsx'

// Show one category: its limit, what was spent, what is left, and a bar.
export default function CategoryCard({ category, limit, spent }) {
  const remaining = limit - spent
  // Guard against a zero limit so we never divide by zero.
  const percent = limit > 0 ? (spent / limit) * 100 : 0
  const isOver = percent > 100
  const isWarning = !isOver && percent >= 80

  // The bar never grows past the edge of its track.
  const barWidth = Math.min(percent, 100)

  let statusClass = ''
  let statusText = `${formatRs(remaining)} left`
  if (isOver) {
    statusClass = 'over'
    statusText = `${formatRs(Math.abs(remaining))} over budget`
  } else if (isWarning) {
    statusClass = 'warning'
    statusText = `Almost there — ${formatRs(remaining)} left`
  }

  return (
    <article className={`category-card ${statusClass}`}>
      <div className="category-head">
        <h3>{category}</h3>
        <span className="category-spent">
          {formatRs(spent)} <span className="muted">/ {formatRs(limit)}</span>
        </span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${barWidth}%` }} />
      </div>
      <p className="category-status">{statusText}</p>
    </article>
  )
}
