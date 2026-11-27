export default function TaskList({
  tasks,
  selectedTaskId,
  onSelect,
  onToggleComplete,
  onDelete,
}) {
  if (tasks.length === 0) {
    return <p className="empty-note">No tasks yet. Add your first task above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const isSelected = task.id === selectedTaskId;
        // Progress toward the estimated number of sessions, capped at 100%.
        const progress =
          task.estimate > 0
            ? Math.min(100, Math.round((task.done / task.estimate) * 100))
            : 0;
        return (
          <li
            key={task.id}
            className={isSelected ? 'task-item selected' : 'task-item'}
          >
            <button
              className="task-select"
              onClick={() => onSelect(task.id)}
              title="Focus on this task"
            >
              <span className={task.completed ? 'task-name done' : 'task-name'}>
                {task.name}
              </span>
              <span className="task-meta">
                {task.done} of {task.estimate} sessions
                {task.done >= task.estimate && !task.completed
                  ? ' · estimate reached'
                  : ''}
              </span>
              <span className="progress-bar">
                <span style={{ width: `${progress}%` }} />
              </span>
            </button>
            <div className="task-actions">
              <label className="task-check">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                />
                Done
              </label>
              <button className="btn btn-small" onClick={() => onDelete(task.id)}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
