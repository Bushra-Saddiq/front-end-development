import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import Timer from './components/Timer.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import SettingsForm from './components/SettingsForm.jsx';
import { useTimer } from './hooks/useTimer.js';

// Example tasks, so the app is not empty on first open.
const seedTasks = [
  { id: 'task-1', name: 'Practice React hooks', estimate: 3, done: 1, completed: false },
  { id: 'task-2', name: 'Design portfolio homepage', estimate: 2, done: 0, completed: false },
  { id: 'task-3', name: 'Read CSS flexbox guide', estimate: 1, done: 0, completed: false },
];
// Two finished sessions from today, so the stats show something.
const seedSessions = [
  { id: 'session-1', taskId: 'task-1', taskName: 'Practice React hooks', minutes: 25, date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'session-2', taskId: 'task-3', taskName: 'Read CSS flexbox guide', minutes: 25, date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];
// Read saved data, or use the seed data if there is nothing saved yet.
function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}
export default function App() {
  const [tasks, setTasks] = useState(() => load('focusflow-tasks', seedTasks));
  const [sessions, setSessions] = useState(() => load('focusflow-sessions', seedSessions));
  const [settings, setSettings] = useState(() => load('focusflow-settings', { work: 25, shortBreak: 5, longBreak: 15 }));
  const [selectedId, setSelectedId] = useState('task-1');
  const [banner, setBanner] = useState('');
  // Save everything whenever it changes.
  useEffect(() => {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
    localStorage.setItem('focusflow-sessions', JSON.stringify(sessions));
    localStorage.setItem('focusflow-settings', JSON.stringify(settings));
  }, [tasks, sessions, settings]);
  const selectedTask = tasks.find((t) => t.id === selectedId) || tasks[0] || null;
  // Called by the timer when a session ends.
  function handleSessionEnd(finishedMode) {
    if (finishedMode === 'work') {
      setSessions((prev) => [
        { id: 'session-' + Date.now(), taskId: selectedTask ? selectedTask.id : null, taskName: selectedTask ? selectedTask.name : 'Focus session', minutes: settings.work, date: new Date().toISOString() },
        ...prev,
      ]);
      if (selectedTask && !selectedTask.completed) {
        setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, done: t.done + 1 } : t)));
      }
      setBanner('Work session done! Time for a break.');
    } else {
      setBanner('Break over. Ready to focus again?');
    }
  }
  const timer = useTimer(settings, handleSessionEnd);
  function addTask(name, estimate) {
    const task = { id: 'task-' + Date.now(), name, estimate, done: 0, completed: false };
    setTasks((prev) => [...prev, task]);
    setSelectedId(task.id);
  }
  function deleteTask(id) { setTasks((prev) => prev.filter((t) => t.id !== id)); }
  function toggleComplete(id) { setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))); }
  return (
    <div className="app">
      <header>
        <h1>FocusFlow</h1>
        <p>Pick a task, focus for one Pomodoro, then take a break.</p>
      </header>
      {banner && <p className="banner">{banner} <button onClick={() => setBanner('')}>×</button></p>}
      <section className="card">
        <Timer timer={timer} selectedTask={selectedTask} onStart={() => { setBanner(''); timer.start(); }} />
      </section>
      <section className="card">
        <h2>Your tasks</h2>
        <TaskForm onAddTask={addTask} />
        <TaskList tasks={tasks} selectedTaskId={selectedTask ? selectedTask.id : null} onSelect={setSelectedId} onToggleComplete={toggleComplete} onDelete={deleteTask} />
      </section>
      <section className="card">
        <StatsPanel sessions={sessions} />
      </section>
      <section className="card">
        <SettingsForm settings={settings} onSave={setSettings} />
      </section>
    </div>
  );
}
