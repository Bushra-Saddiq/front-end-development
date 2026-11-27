import { formatRs } from '../utils.js'

export default function ExpenseList({ people, expenses, onDeleteExpense }) {
  // Turn an id into a name, so we can show "Paid by Bushra".
  function getName(id) {
    const person = people.find((p) => p.id === id)
    return person ? person.name : 'Unknown'
  }

  return (
    <section className="card">
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses yet. Add your first one above.</p>
      ) : (
        <ul className="list">
          {expenses.map((expense) => {
            const share = expense.amount / expense.sharedBy.length
            const sharers = expense.sharedBy.map(getName).join(', ')
            return (
              <li key={expense.id} className="row-between">
                <div>
                  <strong>{expense.description}</strong>
                  <br />
                  <small>Paid by {getName(expense.paidBy)} · split between {sharers} · {formatRs(share)} each</small>
                </div>
                <strong>{formatRs(expense.amount)}</strong>
                <button className="link-btn" type="button" onClick={() => onDeleteExpense(expense.id)}>Delete</button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
