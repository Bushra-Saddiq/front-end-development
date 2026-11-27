import { formatRs } from '../utils.js'

export default function ExpenseList({ people, expenses, onDeleteExpense }) {
  // A quick lookup so we can show names instead of ids.
  const nameById = {}
  people.forEach((person) => {
    nameById[person.id] = person.name
  })

  return (
    <section className="card">
      <h2>Expenses</h2>

      {expenses.length === 0 ? (
        <p className="empty">No expenses yet. Add your first one above.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => {
            const share = expense.sharedBy.length
              ? expense.amount / expense.sharedBy.length
              : 0
            const sharers = expense.sharedBy
              .map((id) => nameById[id] || 'Unknown')
              .join(', ')

            return (
              <li key={expense.id} className="expense-row">
                <div className="expense-main">
                  <span className="expense-description">{expense.description}</span>
                  <span className="expense-detail">
                    Paid by {nameById[expense.paidBy] || 'Unknown'} · split between {sharers} ·{' '}
                    {formatRs(share)} each
                  </span>
                </div>
                <span className="expense-amount">{formatRs(expense.amount)}</span>
                <button
                  className="btn-text"
                  type="button"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
