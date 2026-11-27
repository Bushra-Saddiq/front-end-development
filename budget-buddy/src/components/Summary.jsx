import { useMemo } from 'react'
import { formatRs, useBudget } from '../context/BudgetContext.jsx'

// Income, expenses and savings for one month ("YYYY-MM").
export default function Summary({ month }) {
  const { transactions } = useBudget()

  const totals = useMemo(() => {
    const inMonth = transactions.filter((item) => item.date.startsWith(month))
    const income = inMonth
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const expenses = inMonth
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)
    return { income, expenses, savings: income - expenses }
  }, [transactions, month])

  return (
    <div className="summary-grid">
      <div className="stat">
        <span className="stat-label">Income</span>
        <span className="stat-value income">+ {formatRs(totals.income)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Expenses</span>
        <span className="stat-value expense">− {formatRs(totals.expenses)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Savings</span>
        <span className="stat-value">{formatRs(totals.savings)}</span>
      </div>
    </div>
  )
}
