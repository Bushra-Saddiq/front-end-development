import { useEffect, useState } from 'react'

export default function ExpenseForm({ people, onAddExpense }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(people[0] ? people[0].id : '')
  // Everyone shares by default. Untick people who are not part of this expense.
  const [sharedBy, setSharedBy] = useState(people.map((person) => person.id))
  const [message, setMessage] = useState('')

  // If the people list changes (someone added or removed), drop any checked
  // ids that no longer exist, so we never submit a stale person.
  useEffect(() => {
    setSharedBy((prev) => prev.filter((id) => people.some((person) => person.id === id)))
    setPaidBy((prev) => (people.some((person) => person.id === prev) ? prev : people[0]?.id || ''))
  }, [people])

  function toggleSharer(personId) {
    setSharedBy((prev) =>
      prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId]
    )
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!description.trim()) {
      setMessage('Please write a short description, like "Weekly groceries".')
      return
    }
    const value = Number(amount)
    if (!value || value <= 0) {
      setMessage('Please enter an amount above Rs 0.')
      return
    }
    if (!paidBy) {
      setMessage('Please choose who paid.')
      return
    }
    if (sharedBy.length === 0) {
      setMessage('Please tick at least one person who shared this expense.')
      return
    }

    onAddExpense({
      description: description.trim(),
      amount: value,
      paidBy,
      sharedBy,
    })
    setDescription('')
    setAmount('')
    setMessage('')
  }

  if (people.length === 0) {
    return (
      <section className="card">
        <h2>Add an expense</h2>
        <p className="empty">Add people first, then you can record expenses.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>Add an expense</h2>

      <form className="stack-form" onSubmit={handleSubmit}>
        <label>
          What was it?
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Weekly groceries"
          />
        </label>

        <label>
          Amount (Rs)
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 3000"
          />
        </label>

        <label>
          Who paid?
          <select value={paidBy} onChange={(event) => setPaidBy(event.target.value)}>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>Who shared it?</legend>
          <div className="checkbox-list">
            {people.map((person) => (
              <label key={person.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={sharedBy.includes(person.id)}
                  onChange={() => toggleSharer(person.id)}
                />
                {person.name}
              </label>
            ))}
          </div>
        </fieldset>

        {message && <p className="message">{message}</p>}

        <button className="btn" type="submit">
          Add expense
        </button>
      </form>
    </section>
  )
}
