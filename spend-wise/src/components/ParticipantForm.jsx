import { useState } from 'react'

export default function ParticipantForm({ people, onAddPerson, onRemovePerson, personIsInExpenses }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    onAddPerson(name.trim())
    setName('')
    setMessage('')
  }

  function handleRemove(person) {
    // Don't remove someone who is part of an expense.
    if (personIsInExpenses(person.id)) {
      setMessage(person.name + ' is part of an expense. Delete those expenses first.')
      return
    }
    setMessage('')
    onRemovePerson(person.id)
  }

  return (
    <section className="card">
      <h2>People</h2>
      <p>Add everyone who shares expenses with you.</p>

      <form className="row" onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Person's name" />
        <button className="btn" type="submit">Add person</button>
      </form>

      {message && <p className="message">{message}</p>}

      {people.length === 0 ? (
        <p>No people yet. Add someone to get started.</p>
      ) : (
        <ul className="chips">
          {people.map((person) => (
            <li key={person.id} className="chip">
              {person.name}
              <button type="button" onClick={() => handleRemove(person)}>×</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
