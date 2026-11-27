import { formatRs } from '../context/BudgetContext.jsx'
// One category: its limit, what was spent, what is left, and a bar.
export default function CategoryCard({ category, limit, spent }) {
  const remaining = limit - spent
  const percent = limit > 0 ? (spent / limit) * 100 : 0
  let status = ''
  let text = formatRs(remaining) + ' left'
  if (percent > 100) {
    status = 'over'
    text = formatRs(-remaining) + ' over budget'
  } else if (percent >= 80) {
    status = 'warning'
    text = 'Almost there — ' + formatRs(remaining) + ' left'
  }
  return (
    <article className={'category-card ' + status}>
      <div className="category-head">
        <h3>{category}</h3>
        <span className="category-spent">{formatRs(spent)} <span className="muted">/ {formatRs(limit)}</span></span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: Math.min(percent, 100) + '%' }} />
      </div>
      <p className="category-status">{text}</p>
    </article>
  )
}
