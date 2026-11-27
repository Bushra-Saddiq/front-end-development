import { useState } from 'react';

export default function TaskForm({ onAddTask }) {
  const [name, setName] = useState('');
  const [estimate, setEstimate] = useState(2);

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    // Keep the estimate between 1 and 8 sessions.
    const sessions = Math.min(8, Math.max(1, Number(estimate) || 1));
    onAddTask(name.trim(), sessions);
    setName('');
    setEstimate(2);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Task name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Practice React hooks" />
      </label>
      <label>
        Sessions
        <input type="number" min="1" max="8" value={estimate} onChange={(e) => setEstimate(e.target.value)} />
      </label>
      <button className="btn btn-primary" type="submit">Add task</button>
    </form>
  );
}
