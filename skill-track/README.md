# SkillTrack – Personal Learning Tracker

A small React app for tracking the skills you are learning and watching
your progress grow. Add a skill, set a goal for it, and nudge the progress
bar forward as you learn.

## What's in this folder

The code to read is in `src/` — that is the project. The other files are setup that Vite and npm need:

- `src/App.jsx` — the skills list, the filters, and the stats
- `src/components/` — `SkillForm`, `SkillCard`, `SkillList`, `StatsBar`, `FilterBar`
- `src/index.css` — all the styling
- `package.json` — the libraries this project uses, and the commands to run it (`npm install`, `npm run dev`)
- `README.md` — this file
- `index.html` — the page that loads the app (Vite boilerplate)
- `vite.config.js` — Vite's settings (boilerplate)
- `package-lock.json` — written automatically by npm; a receipt of the exact library versions. Nobody writes it by hand.
- `.gitignore` — tells Git which files not to upload (like `node_modules`)

## What it does

- Add a skill with a name, a category (Frontend, Backend, Database,
  Design, or Other) and a short learning goal.
- Update progress with a progress bar and simple +10 / -10 buttons.
- A skill is marked completed automatically when its progress reaches
  100%. You can also mark it completed by hand, or un-mark it.
- Filter skills by category and by status (All / In progress / Completed).
- Sort the list by highest progress or lowest progress.
- Delete skills you no longer track.
- See your overall numbers at the top: total skills, completed skills,
  and average progress.
- Everything is saved in the browser with localStorage, so your skills
  are still there when you come back.

It opens with four example skills (React, JavaScript, Python, Figma) so
you can see how it works right away. Add your own, or delete the
examples and start fresh.

## How to run it

You need Node.js installed. Then, from this folder:

```bash
npm install
npm run dev
```

Open the address Vite prints in your terminal (usually
`http://localhost:5173`).

To make a production build:

```bash
npm run build
```

## React concepts practiced

- **Components and props** – the app is split into small pieces
  (`SkillForm`, `SkillCard`, `SkillList`, `StatsBar`, `FilterBar`), and
  data and callbacks travel down through props.
- **useState** – the skills list, the form inputs, and the filters all
  live in state.
- **useEffect** – saves the skills to localStorage every time they change.
- **Controlled forms** – every form input is tied to state, so React
  always knows what was typed.
- **Filtering and sorting** – array methods (`filter`, `sort`, `map`,
  `reduce`) shape the list the user sees.
- **Reusable components** – one `SkillCard` renders every skill in the
  list.
- **localStorage** – skills load from the browser when the app starts and
  save with `useEffect`, so nothing is lost on refresh.

## Tech

- Vite + React 19
- Plain CSS (no UI library, no framework CSS)
- Fraunces for headings, Inter for body text
