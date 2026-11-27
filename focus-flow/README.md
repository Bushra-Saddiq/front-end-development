# FocusFlow – Pomodoro and Task Timer

A to-do list combined with a Pomodoro timer. Pick a task, focus for one
session, then take a break — and see how much focused time you actually put
in.

## What's in this folder

The code to read is in `src/` — that is the project. The other files are setup that Vite and npm need:

- `src/App.jsx` — the tasks, the sessions, and the settings
- `src/hooks/useTimer.js` — all the timer logic in one reusable place
- `src/components/` — `TaskForm`, `TaskList`, `Timer`, `StatsPanel`, `SettingsForm`
- `src/index.css` — all the styling
- `package.json` — the libraries this project uses, and the commands to run it (`npm install`, `npm run dev`)
- `README.md` — this file
- `index.html` — the page that loads the app (Vite boilerplate)
- `vite.config.js` — Vite's settings (boilerplate)
- `package-lock.json` — written automatically by npm; a receipt of the exact library versions. Nobody writes it by hand.
- `.gitignore` — tells Git which files not to upload (like `node_modules`)

## Features

- Add tasks with an estimated number of Pomodoro sessions.
- Select a task and run a countdown timer for it (start, pause, reset).
- Automatic switching: a work session is followed by a short break, and every
  4th work session is followed by a long break.
- Change the work, short-break and long-break durations in settings
  (defaults: 25 / 5 / 15 minutes).
- Mark tasks as completed, and delete tasks you no longer need.
- Every finished work session is logged on its task and in the session log.
- Daily and weekly focus statistics, worked out from the session log.
- When a session ends, a short beep plays (made with the Web Audio API, no
  audio file needed) and a message banner appears.
- Everything is saved in your browser (localStorage), so your tasks and
  history are still there when you come back.

## How to run

```bash
npm install
npm run dev
```

Then open the address shown in the terminal (usually
`http://localhost:5173`).

To make a production build:

```bash
npm run build
```

## React concepts practiced

- **useState** — tasks, sessions, settings and form inputs.
- **useEffect** — the timer interval (with cleanup), and saving to
  localStorage.
- **Custom hook (`useTimer`)** — all timer logic in one reusable place.
- **Props** — small components that receive data and callbacks from `App`.
- **Conditional rendering** — start/pause button, banner, empty states.
- **Derived state** — statistics and progress bars worked out from the
  session log and task data.
- **localStorage** — tasks, sessions and settings load when the app starts
  and save with `useEffect`.

## Project structure

```
src/
  main.jsx              # Entry point, renders App
  App.jsx               # Tasks, sessions and settings state
  index.css             # Design tokens and all component styles
  hooks/
    useTimer.js         # Pomodoro timer: countdown, mode switching, beep
  components/
    TaskForm.jsx        # Add a task with an estimated session count
    TaskList.jsx        # Task list with progress bars and actions
    Timer.jsx           # Countdown display, mode tabs, start/pause/reset
    StatsPanel.jsx      # Daily/weekly stats and the session log
    SettingsForm.jsx    # Change work and break durations
```
