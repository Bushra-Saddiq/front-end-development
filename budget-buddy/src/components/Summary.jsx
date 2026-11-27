import { formatRs, useBudget } from '../context/BudgetContext.jsx'
// Income, expenses and savings for one month ("YYYY-MM").
export default function Summary({ month }) {
  const { transactions } = useBudget()
  let income = 0
  let expenses = 0
  for (const item of transactions) {
    if (!item.date.startsWith(month)) continue
    if (item.type === 'income') income += item.amount
    else expenses += item.amount
  }
  const savings = income - expenses
  return (
    <div className="summary-grid">
      <div className="stat">
        <span className="stat-label">Income</span>
        <span className="stat-value income">+ {formatRs(income)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Expenses</span>
        <span className="stat-value expense">− {formatRs(expenses)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Savings</span>
        <span className="stat-value">{formatRs(savings)}</span>
      </div>
    </div>
  )
}
