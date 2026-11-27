// The list of options, each with its weight and Edit / Delete buttons.
export default function OptionList({ options, onEdit, onDelete }) {
  if (options.length === 0) {
    return <p className="empty-note">No options yet. Add your first one above.</p>
  }

  return (
    <ul className="option-list">
      {options.map((option) => (
        <li key={option.id} className="option-row">
          <span className="option-name">{option.name}</span>
          <span className="weight-badge">Priority {option.weight}</span>
          <button
            className="btn btn-small"
            type="button"
            onClick={() => onEdit(option)}
          >
            Edit
          </button>
          <button
            className="btn btn-small btn-danger"
            type="button"
            onClick={() => onDelete(option.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
