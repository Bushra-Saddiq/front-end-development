export default function TaskList({ tasks, selectedTaskId, onSelect, onToggleComplete, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-note">No tasks yet. Add your first task above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.id === selectedTaskId ? 'task-item selected' : 'task-item'}>
          <button className="task-select" onClick={() => onSelect(task.id)}>
            <span className={task.completed ? 'task-name done' : 'task-name'}>{task.name}</span>
            <span className="task-meta">{task.done} of {task.estimate} sessions</span>
            <span className="progress-bar">
              <span style={{ width: Math.min(100, Math.round((task.done / task.estimate) * 100)) + '%' }} />
            </span>
          </button>
          <label className="task-check">
            <input type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task.id)} />
            Done
          </label>
          <button className="btn btn-small" onClick={() => onDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
