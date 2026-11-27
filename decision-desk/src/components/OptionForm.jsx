import { useEffect, useState } from 'react'

// Form for adding a new option, and for editing an existing one.
// When `editing` is given, the form starts filled with that option's values.
// `inputRef` is passed down from App so the name field can be focused
// again after an option is added.
export default function OptionForm({ onAdd, onSaveEdit, onCancelEdit, editing, inputRef }) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState(3)

  // When the user clicks "Edit" on an option, fill the form with its values.
  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setWeight(editing.weight)
    }
  }, [editing])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (trimmedName === '') return

    if (editing) {
      onSaveEdit({ ...editing, name: trimmedName, weight: Number(weight) })
    } else {
      onAdd({ id: Date.now(), name: trimmedName, weight: Number(weight) })
      setName('')
      setWeight(3)
      // Put the cursor back in the name field so another option can be
      // typed straight away.
      inputRef.current?.focus()
    }
  }

  return (
    <form className="option-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="option-name">Option</label>
        <input
          id="option-name"
          ref={inputRef}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Learn React"
        />
      </div>

      <div className="field">
        <label htmlFor="option-weight">Priority (1–5)</label>
        <select
          id="option-weight"
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
        >
          <option value={1}>1 – Low</option>
          <option value={2}>2</option>
          <option value={3}>3 – Medium</option>
          <option value={4}>4</option>
          <option value={5}>5 – High</option>
        </select>
      </div>

      <button className="btn btn-primary" type="submit">
        {editing ? 'Save changes' : 'Add option'}
      </button>

      {editing && (
        <button className="btn btn-ghost" type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  )
}
