import { useMemo } from 'react'
import { formatRs } from '../utils.js'

// Work out who pays whom with a simple greedy match:
// the person who owes the most pays the person who is owed the most first.
function buildSettlements(balances) {
  // Only people with a real balance take part. The 0.5 cutoff ignores
  // tiny rounding dust (a few paisas) so the list stays clean.
  const debtors = balances
    .filter((person) => person.balance < -0.5)
    .map((person) => ({ name: person.name, owes: -person.balance }))
    .sort((a, b) => b.owes - a.owes)

  const creditors = balances
    .filter((person) => person.balance > 0.5)
    .map((person) => ({ name: person.name, owed: person.balance }))
    .sort((a, b) => b.owed - a.owed)

  const settlements = []
  let debtorIndex = 0
  let creditorIndex = 0

  // Keep matching the biggest debtor with the biggest creditor until
  // one side runs out. Each step settles at least one person fully.
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    const amount = Math.min(debtor.owes, creditor.owed)

    settlements.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount) })

    debtor.owes -= amount
    creditor.owed -= amount
    if (debtor.owes < 0.5) debtorIndex++
    if (creditor.owed < 0.5) creditorIndex++
  }

  return settlements
}

export default function Balances({ people, expenses }) {
  // Balances are derived from the expenses, so they always stay in sync.
  const balances = useMemo(() => {
    return people.map((person) => {
      const paid = expenses
        .filter((expense) => expense.paidBy === person.id)
        .reduce((sum, expense) => sum + expense.amount, 0)

      const share = expenses
        .filter((expense) => expense.sharedBy.includes(person.id))
        .reduce(
          (sum, expense) =>
            sum + (expense.sharedBy.length ? expense.amount / expense.sharedBy.length : 0),
          0
        )

      return { ...person, paid, share, balance: paid - share }
    })
  }, [people, expenses])

  const settlements = useMemo(() => buildSettlements(balances), [balances])

  const everyoneSettled = balances.every((person) => Math.abs(person.balance) < 0.5)

  return (
    <section className="card">
      <h2>Balances</h2>

      {expenses.length === 0 ? (
        <p className="empty">Add an expense to see who owes whom.</p>
      ) : (
        <>
          <ul className="balance-list">
            {balances.map((person) => (
              <li key={person.id} className="balance-row">
                <span className="balance-name">{person.name}</span>
                <span className="balance-detail">
                  Paid {formatRs(person.paid)} · Share {formatRs(person.share)}
                </span>
                {person.balance > 0.5 && (
                  <span className="balance-status is-owed">
                    Is owed {formatRs(person.balance)}
                  </span>
                )}
                {person.balance < -0.5 && (
                  <span className="balance-status owes">
                    Owes {formatRs(-person.balance)}
                  </span>
                )}
                {Math.abs(person.balance) <= 0.5 && (
                  <span className="balance-status settled">Settled up</span>
                )}
              </li>
            ))}
          </ul>

          <h3>Who pays whom</h3>
          {everyoneSettled ? (
            <p className="empty">Everyone is settled up. Nothing to pay.</p>
          ) : (
            <ul className="settlement-list">
              {settlements.map((settlement, index) => (
                <li key={index} className="settlement-row">
                  <span>
                    <strong>{settlement.from}</strong> pays <strong>{settlement.to}</strong>
                  </span>
                  <span className="settlement-amount">{formatRs(settlement.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
