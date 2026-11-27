import { useState } from 'react';

export default function SettingsForm({ settings, onSave }) {
  const [work, setWork] = useState(settings.work);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Keep durations sensible: between 1 and 120 minutes.
    const clean = (value, fallback) => {
      const number = Number(value);
      if (!Number.isFinite(number)) {
        return fallback;
      }
      return Math.min(120, Math.max(1, Math.round(number)));
    };
    onSave({
      work: clean(work, 25),
      shortBreak: clean(shortBreak, 5),
      longBreak: clean(longBreak, 15),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h2>Timer settings</h2>
      <p className="settings-note">
        Saving new durations resets the current timer.
      </p>
      <div className="form-row">
        <label className="field">
          <span>Focus (minutes)</span>
          <input
            type="number"
            min="1"
            max="120"
            value={work}
            onChange={(event) => setWork(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Short break (minutes)</span>
          <input
            type="number"
            min="1"
            max="120"
            value={shortBreak}
            onChange={(event) => setShortBreak(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Long break (minutes)</span>
          <input
            type="number"
            min="1"
            max="120"
            value={longBreak}
            onChange={(event) => setLongBreak(event.target.value)}
          />
        </label>
      </div>
      <button className="btn btn-primary" type="submit">
        Save settings
      </button>
      {saved && <span className="saved-note">Saved!</span>}
    </form>
  );
}
