import { useState } from 'react'

export default function ParticipantForm({ people, onAddPerson, onRemovePerson, personIsInExpenses }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAddPerson(trimmed)
    setName('')
    setMessage('')
  }

  function handleRemove(person) {
    if (personIsInExpenses(person.id)) {
      // Block the removal and say why, instead of leaving a broken expense.
      setMessage(
        `${person.name} is part of an expense, so remove or change those expenses first.`
      )
      return
    }
    setMessage('')
    onRemovePerson(person.id)
  }

  return (
    <section className="card">
      <h2>People</h2>
      <p className="hint">Add everyone who shares expenses with you.</p>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Person's name"
          aria-label="Person's name"
        />
        <button className="btn" type="submit">
          Add person
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {people.length === 0 ? (
        <p className="empty">No people yet. Add someone to get started.</p>
      ) : (
        <ul className="chip-list">
          {people.map((person) => (
            <li key={person.id} className="chip">
              <span>{person.name}</span>
              <button
                className="chip-remove"
                type="button"
                onClick={() => handleRemove(person)}
                aria-label={`Remove ${person.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
