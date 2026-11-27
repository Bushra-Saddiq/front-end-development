import { formatRs } from '../utils.js'

export default function Balances({ people, expenses }) {
  return (
    <section className="card">
      <h2>Balances</h2>
      {expenses.length === 0 ? (
        <p>Add an expense to see who owes whom.</p>
      ) : (
        <ul className="list">
          {people.map((person) => {
            // Add up what this person paid, and their share of everything.
            let paid = 0
            let share = 0
            for (const expense of expenses) {
              if (expense.paidBy === person.id) paid += expense.amount
              if (expense.sharedBy.includes(person.id)) {
                share += expense.amount / expense.sharedBy.length
              }
            }
            const balance = paid - share

            // A positive balance means the others owe this person.
            let status = 'Settled up'
            if (balance > 0) status = 'Is owed ' + formatRs(balance)
            if (balance < 0) status = 'Owes ' + formatRs(-balance)

            return (
              <li key={person.id} className="row-between">
                <div>
                  <strong>{person.name}</strong>
                  <br />
                  <small>Paid {formatRs(paid)} · Share {formatRs(share)}</small>
                </div>
                <strong>{status}</strong>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
