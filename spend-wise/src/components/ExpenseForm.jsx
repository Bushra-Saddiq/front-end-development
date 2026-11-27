import { useEffect, useState } from 'react'

export default function ExpenseForm({ people, onAddExpense }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(people[0] ? people[0].id : '')
  const [sharedBy, setSharedBy] = useState(people.map((person) => person.id))
  const [message, setMessage] = useState('')

  // If the people list changes, drop anyone who no longer exists.
  useEffect(() => {
    setSharedBy((prev) => prev.filter((id) => people.some((person) => person.id === id)))
    if (!people.some((person) => person.id === paidBy)) {
      setPaidBy(people[0] ? people[0].id : '')
    }
  }, [people])

  function toggleSharer(personId) {
    if (sharedBy.includes(personId)) {
      setSharedBy(sharedBy.filter((id) => id !== personId))
    } else {
      setSharedBy([...sharedBy, personId])
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!description.trim()) {
      setMessage('Please write a short description.')
      return
    }
    const value = Number(amount)
    if (!value || value <= 0) {
      setMessage('Please enter an amount above Rs 0.')
      return
    }
    if (sharedBy.length === 0) {
      setMessage('Please tick at least one person who shared this expense.')
      return
    }

    onAddExpense({ description: description.trim(), amount: value, paidBy, sharedBy })
    setDescription('')
    setAmount('')
    setMessage('')
  }

  if (people.length === 0) {
    return (
      <section className="card">
        <h2>Add an expense</h2>
        <p>Add people first, then you can record expenses.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>Add an expense</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          What was it?
          <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Weekly groceries" />
        </label>
        <label>
          Amount (Rs)
          <input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 3000" />
        </label>
        <label>
          Who paid?
          <select value={paidBy} onChange={(event) => setPaidBy(event.target.value)}>
            {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
        </label>
        <fieldset>
          <legend>Who shared it?</legend>
          {people.map((person) => (
            <label key={person.id} className="check">
              <input type="checkbox" checked={sharedBy.includes(person.id)} onChange={() => toggleSharer(person.id)} />
              {person.name}
            </label>
          ))}
        </fieldset>
        {message && <p className="message">{message}</p>}
        <button className="btn" type="submit">Add expense</button>
      </form>
    </section>
  )
}
