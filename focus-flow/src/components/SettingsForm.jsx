import { useState } from 'react';

export default function SettingsForm({ settings, onSave }) {
  const [work, setWork] = useState(settings.work);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [saved, setSaved] = useState(false);
  // Keep a duration between 1 and 120 minutes.
  function clean(value, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(120, Math.max(1, Math.round(number)));
  }
  function handleSubmit(event) {
    event.preventDefault();
    onSave({ work: clean(work, 25), shortBreak: clean(shortBreak, 5), longBreak: clean(longBreak, 15) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Timer settings</h2>
      <p className="settings-note">Saving new durations resets the current timer.</p>
      <div className="form-row">
        <label>Focus (minutes)
          <input type="number" min="1" max="120" value={work} onChange={(e) => setWork(e.target.value)} />
        </label>
        <label>Short break (minutes)
          <input type="number" min="1" max="120" value={shortBreak} onChange={(e) => setShortBreak(e.target.value)} />
        </label>
        <label>Long break (minutes)
          <input type="number" min="1" max="120" value={longBreak} onChange={(e) => setLongBreak(e.target.value)} />
        </label>
      </div>
      <button className="btn btn-primary" type="submit">Save settings</button>
      {saved && <span className="saved-note"> Saved!</span>}
    </form>
  );
}
