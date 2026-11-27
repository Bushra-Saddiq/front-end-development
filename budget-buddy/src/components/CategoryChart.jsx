import { CATEGORIES, formatRs, useBudget } from '../context/BudgetContext.jsx'
// A simple bar chart made of plain divs — no chart library.
export default function CategoryChart({ month }) {
  const { transactions } = useBudget()
  const spending = CATEGORIES.map((category) => {
    let spent = 0
    for (const item of transactions) {
      if (item.type === 'expense' && item.category === category && item.date.startsWith(month)) spent += item.amount
    }
    return { category, spent }
  })
  const biggest = Math.max(...spending.map((item) => item.spent))
  if (biggest === 0) {
    return <p className="muted">No expenses in this month yet.</p>
  }
  return (
    <div className="chart">
      {spending.map(({ category, spent }) => (
        <div key={category} className="chart-row">
          <span className="chart-label">{category}</span>
          <div className="chart-track">
            <div className="chart-fill" style={{ width: (spent / biggest) * 100 + '%' }} />
          </div>
          <span className="chart-value">{formatRs(spent)}</span>
        </div>
      ))}
    </div>
  )
}
