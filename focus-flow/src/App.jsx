import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import Timer from './components/Timer.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import SettingsForm from './components/SettingsForm.jsx';
import { useTimer } from './hooks/useTimer.js';

// Seed data so the app feels alive on first open.
const seedTasks = [
  { id: 'task-1', name: 'Practice React hooks', estimate: 3, done: 1, completed: false },
  { id: 'task-2', name: 'Design portfolio homepage', estimate: 2, done: 0, completed: false },
  { id: 'task-3', name: 'Read CSS flexbox guide', estimate: 1, done: 0, completed: false },
];

// Two finished sessions from today, so the stats are not empty on first open.
function seedSessions() {
  const now = new Date();
  return [
    {
      id: 'session-1',
      taskId: 'task-1',
      taskName: 'Practice React hooks',
      minutes: 25,
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'session-2',
      taskId: 'task-3',
      taskName: 'Read CSS flexbox guide',
      minutes: 25,
      date: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Load saved data from localStorage, or fall back to the seed data.
// The lazy useState initializer below runs this only once, on first render.
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(() =>
    loadFromStorage('focusflow-tasks', seedTasks)
  );
  const [sessions, setSessions] = useState(() =>
    loadFromStorage('focusflow-sessions', seedSessions())
  );
  const [settings, setSettings] = useState(() =>
    loadFromStorage('focusflow-settings', { work: 25, shortBreak: 5, longBreak: 15 })
  );
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    const savedTasks = loadFromStorage('focusflow-tasks', seedTasks);
    return savedTasks.length > 0 ? savedTasks[0].id : null;
  });
  const [banner, setBanner] = useState(null);

  // Save each list to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('focusflow-sessions', JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem('focusflow-settings', JSON.stringify(settings));
  }, [settings]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  // What happens when a timer session ends.
  const handleSessionEnd = (finishedMode) => {
    if (finishedMode === 'work') {
      // Log the finished work session and credit it to the selected task.
      const entry = {
        id: `session-${Date.now()}`,
        taskId: selectedTask ? selectedTask.id : null,
        taskName: selectedTask ? selectedTask.name : 'Focus session',
        minutes: settings.work,
        date: new Date().toISOString(),
      };
      setSessions((prev) => [entry, ...prev]);
      if (selectedTask && !selectedTask.completed) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === selectedTask.id ? { ...task, done: task.done + 1 } : task
          )
        );
      }
      setBanner('Work session done! Time for a break.');
    } else {
      setBanner('Break over. Ready to focus again?');
    }
  };

  const timer = useTimer(settings, handleSessionEnd);

  const addTask = (name, estimate) => {
    const task = { id: `task-${Date.now()}`, name, estimate, done: 0, completed: false };
    setTasks((prev) => [...prev, task]);
    setSelectedTaskId(task.id);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };

  const toggleTaskComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Starting the timer also clears the last session-end message.
  const handleStart = () => {
    setBanner(null);
    timer.start();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FocusFlow</h1>
        <p>
          Pick a task, focus for one Pomodoro, then take a break. Small sessions,
          real progress.
        </p>
      </header>

      {banner && (
        <div className="banner">
          <span>{banner}</span>
          <button
            className="banner-close"
            onClick={() => setBanner(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <main>
        <section className="card">
          <Timer timer={timer} selectedTask={selectedTask} onStart={handleStart} />
        </section>

        <section className="card">
          <h2>Your tasks</h2>
          <TaskForm onAddTask={addTask} />
          <TaskList
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelect={setSelectedTaskId}
            onToggleComplete={toggleTaskComplete}
            onDelete={deleteTask}
          />
        </section>

        <section className="card">
          <StatsPanel sessions={sessions} />
        </section>

        <section className="card">
          <SettingsForm settings={settings} onSave={setSettings} />
        </section>
      </main>

      <footer className="app-footer">
        <p>Your tasks, sessions and settings are saved in this browser.</p>
      </footer>
    </div>
  );
}
