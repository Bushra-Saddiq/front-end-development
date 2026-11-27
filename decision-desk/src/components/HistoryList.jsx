// The list of past decisions, newest first. Each entry shows
// the question, the option that was picked, and the date.
export default function HistoryList({ history, onDelete }) {
  if (history.length === 0) {
    return (
      <p className="empty-note">
        No decisions yet. Press “Decide for me” and your first decision will
        appear here.
      </p>
    )
  }

  return (
    <ul className="history-list">
      {history.map((entry) => (
        <li key={entry.id} className="history-row">
          <div>
            <p className="history-question">{entry.question}</p>
            <p className="history-choice">
              Picked: <strong>{entry.choice}</strong>
            </p>
            <p className="history-date">
              {new Date(entry.date).toLocaleString()}
            </p>
          </div>
          <button
            className="btn btn-small btn-danger"
            type="button"
            onClick={() => onDelete(entry.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
