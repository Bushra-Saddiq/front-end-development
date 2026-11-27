import { formatRs, useBudget } from '../context/BudgetContext.jsx'

// The list of transactions. The parent (App) already filters and sorts them.
export default function TransactionList({ transactions, onEdit }) {
  const { deleteTransaction } = useBudget()

  if (transactions.length === 0) {
    return <p className="muted">No transactions match these filters yet. Try another month or category.</p>
  }

  function handleDelete(transaction) {
    if (window.confirm(`Delete "${transaction.description}"?`)) {
      deleteTransaction(transaction.id)
    }
  }

  return (
    <ul className="transaction-list">
      {transactions.map((item) => (
        <li key={item.id} className="transaction-item">
          <div className="transaction-main">
            <span className="transaction-description">{item.description}</span>
            <span className="transaction-meta">
              {formatDate(item.date)} · <span className="tag">{item.category}</span>
            </span>
          </div>
          <div className="transaction-side">
            <span className={`transaction-amount ${item.type}`}>
              {item.type === 'income' ? '+' : '−'} {formatRs(item.amount)}
            </span>
            <div className="transaction-actions">
              <button type="button" className="btn btn-small" onClick={() => onEdit(item)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(item)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

// Turn "2026-11-07" into "7 Nov 2026" for display.
function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
