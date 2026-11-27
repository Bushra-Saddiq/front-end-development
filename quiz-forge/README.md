# QuizForge – Custom Quiz Maker and Player

Make your own multiple-choice quizzes, play them, and review your results
over time. Great for exam revision — or for testing your friends.

## What's in this folder

The code to read is in `src/` — that is the project. The other files are setup that Vite and npm need:

- `src/App.jsx` — the quizzes, the attempts, and which screen is showing
- `src/components/` — `QuizList`, `QuizForm`, `QuestionForm`, `QuizPlayer`, `ResultsReview`, `StatsPanel`
- `src/index.css` — all the styling
- `package.json` — the libraries this project uses, and the commands to run it (`npm install`, `npm run dev`)
- `README.md` — this file
- `index.html` — the page that loads the app (Vite boilerplate)
- `vite.config.js` — Vite's settings (boilerplate)
- `package-lock.json` — written automatically by npm; a receipt of the exact library versions. Nobody writes it by hand.
- `.gitignore` — tells Git which files not to upload (like `node_modules`)

## What it does

- **Create quizzes** with a title, a category, and an optional countdown
  timer (in seconds; 0 means no timer).
- **Add, edit, and delete questions.** Every question has four options and
  one correct answer.
- **Play a quiz** one question at a time, with a progress indicator
  ("Question 2 of 5"). The question order and the answer options are
  shuffled every time you start, so no two attempts are identical.
- **Review your results** at the end: your score, plus every question with
  your answer and the correct answer side by side.
- **Track your history.** Every attempt is saved with its score and date,
  and each quiz shows its best score, average score, and total attempts.
- **Everything is saved in your browser** (localStorage), so your quizzes
  are still there when you come back.

The app starts with one ready-to-play quiz, **HTML Basics**, and one past
attempt on it, so you can see the statistics working right away.

## How to run it

```bash
npm install
npm run dev
```

Then open the address Vite prints in your terminal (usually
http://localhost:5173).

To make a production build:

```bash
npm run build
```

## React concepts practised

- `useState` — quizzes, attempts, form inputs, and the current screen.
- `useEffect` — saving to localStorage, and the countdown timer (with
  cleanup so the interval never keeps running).
- `props` and component composition — the app is split into small
  components: list, forms, player, results, and statistics.
- Controlled forms — every input is tied to state, with simple validation.
- Conditional rendering — the app switches between list, create, edit, play,
  and results screens with plain state (no router).
- Array methods — `map`, `filter`, `find`, and `reduce` for rendering
  lists, finding answers, and working out scores.
- `localStorage` — quizzes and attempts persist between visits.
