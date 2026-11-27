import { formatRs, useBudget } from '../context/BudgetContext.jsx'
// The list of transactions. App already filters and sorts them.
export default function TransactionList({ transactions, onEdit }) {
  const { deleteTransaction } = useBudget()
  if (transactions.length === 0) {
    return <p className="muted">No transactions match these filters yet.</p>
  }
  function handleDelete(item) {
    if (window.confirm('Delete "' + item.description + '"?')) {
      deleteTransaction(item.id)
    }
  }
  return (
    <ul className="transaction-list">
      {transactions.map((item) => (
        <li key={item.id} className="transaction-item">
          <div className="transaction-main">
            <span className="transaction-description">{item.description}</span>
            <span className="transaction-meta">{item.date} · <span className="tag">{item.category}</span></span>
          </div>
          <div className="transaction-side">
            <span className={'transaction-amount ' + item.type}>{item.type === 'income' ? '+ ' : '− '}{formatRs(item.amount)}</span>
            <button type="button" className="btn btn-small" onClick={() => onEdit(item)}>Edit</button>
            <button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(item)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
