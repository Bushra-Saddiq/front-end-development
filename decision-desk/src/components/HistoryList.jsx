// The list of past decisions, newest first. Each entry shows
// the question, the option that was picked, and the date.
export default function HistoryList({ history, onDelete }) {
  if (history.length === 0) {
    return <p>No decisions yet. Press “Decide for me” and your first decision will appear here.</p>
  }

  return (
    <ul className="history-list">
      {history.map((entry) => (
        <li key={entry.id} className="history-row">
          <div>
            <p><strong>{entry.question}</strong></p>
            <p>Picked: {entry.choice}</p>
            <p>{new Date(entry.date).toLocaleString()}</p>
          </div>
          <button className="btn" type="button" onClick={() => onDelete(entry.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
