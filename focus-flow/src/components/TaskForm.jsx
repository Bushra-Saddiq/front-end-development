import { useState } from 'react';

export default function TaskForm({ onAddTask }) {
  const [name, setName] = useState('');
  const [estimate, setEstimate] = useState(2);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    // Keep the estimate sensible: between 1 and 8 sessions.
    const sessions = Math.min(8, Math.max(1, Number(estimate) || 1));
    onAddTask(trimmedName, sessions);
    setName('');
    setEstimate(2);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Task name</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Practice React hooks"
        />
      </label>
      <label className="field field-small">
        <span>Sessions</span>
        <input
          type="number"
          min="1"
          max="8"
          value={estimate}
          onChange={(event) => setEstimate(event.target.value)}
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Add task
      </button>
    </form>
  );
}
