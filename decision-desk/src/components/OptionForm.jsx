import { useEffect, useState } from 'react'

// Form for adding an option, and for editing one.
// When `editing` is given, the form starts filled with that option.
export default function OptionForm({ onAdd, onSaveEdit, onCancelEdit, editing }) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState(3)

  // When the user clicks Edit, fill the form with that option.
  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setWeight(editing.weight)
    }
  }, [editing])

  function handleSubmit(event) {
    event.preventDefault()
    if (name.trim() === '') return

    if (editing) {
      onSaveEdit({ id: editing.id, name: name.trim(), weight: Number(weight) })
    } else {
      onAdd({ id: Date.now(), name: name.trim(), weight: Number(weight) })
      setName('')
      setWeight(3)
    }
  }

  return (
    <form className="option-form" onSubmit={handleSubmit}>
      <label htmlFor="option-name">Option</label>
      <input id="option-name" type="text" value={name}
        onChange={(event) => setName(event.target.value)} placeholder="e.g. Learn React" />
      <label htmlFor="option-weight">Priority (1-5)</label>
      <select id="option-weight" value={weight} onChange={(event) => setWeight(event.target.value)}>
        <option value={1}>1 - Low</option>
        <option value={2}>2</option>
        <option value={3}>3 - Medium</option>
        <option value={4}>4</option>
        <option value={5}>5 - High</option>
      </select>
      <button className="btn btn-primary" type="submit">
        {editing ? 'Save changes' : 'Add option'}
      </button>
      {editing && (
        <button className="btn" type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  )
}
