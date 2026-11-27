# SpendWise – Daily Expense Splitter

A small React app for friends or roommates who share expenses. Add the people,
record what was spent, and the app works out each person's balance — who is
owed money and who owes money.

## What's in this folder

The code to read is in `src/` — that is the project. The other files are setup that Vite and npm need:

- `src/App.jsx` — the people and the expenses
- `src/components/` — `ParticipantForm`, `ExpenseForm`, `ExpenseList`, `Balances`
- `src/utils.js` — a tiny helper that formats amounts in rupees
- `src/index.css` — all the styling
- `package.json` — the libraries this project uses, and the commands to run it (`npm install`, `npm run dev`)
- `README.md` — this file
- `index.html` — the page that loads the app (Vite boilerplate)
- `vite.config.js` — Vite's settings (boilerplate)
- `package-lock.json` — written automatically by npm; a receipt of the exact library versions. Nobody writes it by hand.
- `.gitignore` — tells Git which files not to upload (like `node_modules`)

## Features

- Add and remove participants (removal is blocked while a person is part of an
  expense, so nothing points at a missing person)
- Record an expense with a description, an amount in rupees, who paid, and who
  shared it
- Each expense is split equally among the people who shared it
- Total spending shown at the top
- Per-person balances: how much each person paid, their share, and whether they
  are owed money or owe money
- Delete expenses
- Everything is saved in the browser with localStorage, so a refresh keeps
  your data

## How to run it

```bash
npm install
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

To make a version ready for sharing:

```bash
npm run build
npm run preview
```

## React concepts practiced

- `useState` — people, expenses, and form inputs
- `useEffect` — saving to localStorage, and keeping the form in sync when the
  people list changes
- Props — the App holds the state and passes data and callbacks down to small
  components
- Forms — controlled inputs, checkboxes, and a select for who paid
- Array methods — `map`, `filter`, and `reduce` to build lists, totals, and
  balances
- Conditional rendering — empty states, validation messages, and
  "is owed / owes / settled up"
- localStorage — saved data loads when the app starts, `useEffect` saves it
  when it changes

## Tech

- Vite + React 19
- Plain CSS, no UI libraries
- Amounts are in Pakistani rupees (Rs)
