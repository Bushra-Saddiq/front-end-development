import { useMemo } from 'react'
import { CATEGORIES, formatRs, useBudget } from '../context/BudgetContext.jsx'

// A simple bar chart made of plain divs — no chart library.
// Each bar is sized against the biggest spender that month.
export default function CategoryChart({ month }) {
  const { transactions } = useBudget()

  const spending = useMemo(() => {
    const totals = CATEGORIES.map((category) => {
      const spent = transactions
        .filter(
          (item) =>
            item.type === 'expense' &&
            item.category === category &&
            item.date.startsWith(month)
        )
        .reduce((sum, item) => sum + item.amount, 0)
      return { category, spent }
    })
    return totals
  }, [transactions, month])

  const biggest = Math.max(...spending.map((item) => item.spent), 0)

  if (biggest === 0) {
    return <p className="muted">No expenses in this month yet, so there is nothing to chart.</p>
  }

  return (
    <div className="chart">
      {spending.map(({ category, spent }) => (
        <div key={category} className="chart-row">
          <span className="chart-label">{category}</span>
          <div className="chart-track">
            <div
              className="chart-fill"
              style={{ width: `${(spent / biggest) * 100}%` }}
            />
          </div>
          <span className="chart-value">{formatRs(spent)}</span>
        </div>
      ))}
    </div>
  )
}
