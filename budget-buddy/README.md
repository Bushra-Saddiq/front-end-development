# BudgetBuddy – Personal Budget Planner

A small React app that helps you plan a monthly budget and track what you
actually spend. Set a limit for each category, add your income and expenses,
and see at a glance what is left — with a friendly warning before a category
runs out.

## What's in this folder

The code to read is in `src/` — that is the project. The other files are setup that Vite and npm need:

- `src/App.jsx` — the budgets, the filters, and the add/edit flow
- `src/context/BudgetContext.jsx` — the shared data (transactions and budgets) that every component uses
- `src/components/` — `BudgetSettings`, `TransactionForm`, `TransactionList`, `CategoryCard`, `CategoryChart`, `Summary`
- `src/index.css` — all the styling
- `package.json` — the libraries this project uses, and the commands to run it (`npm install`, `npm run dev`)
- `README.md` — this file
- `index.html` — the page that loads the app (Vite boilerplate)
- `vite.config.js` — Vite's settings (boilerplate)
- `package-lock.json` — written automatically by npm; a receipt of the exact library versions. Nobody writes it by hand.
- `.gitignore` — tells Git which files not to upload (like `node_modules`)

## Features

- Set a monthly spending limit for each category: Food, Transport, Bills, Fun,
  Shopping and Other.
- Add income and expense transactions with a date, amount and category.
- Edit or delete any transaction.
- See the remaining budget per category with a progress bar.
- Warnings when a category reaches 80% of its limit (amber) or goes over it
  (red).
- Filter transactions by month, category and type.
- A monthly summary: total income, total expenses and savings.
- A simple bar chart of spending by category, made with plain CSS.
- Everything is saved in your browser with localStorage, so your data is
  still there after a refresh.

## How to run it

```bash
npm install
npm run dev
```

Then open the address Vite prints in the terminal (usually
http://localhost:5173).

To make a production build:

```bash
npm run build
```

## React concepts practiced

- `useState` — form fields, filters, and the monthly budgets.
- `useEffect` — loading and saving data to localStorage.
- Context API — a small `BudgetContext` shares the data and actions with
  every component, so nothing is passed down through long prop chains.
- Controlled forms — every input is tied to state.
- Array methods — `filter`, `reduce`, `map` and `sort` do the real work.
- Conditional rendering — warnings, empty states, and the add/edit form.
- Reusable components — one `CategoryCard` renders every category.

## Tech

- Vite + React 19
- Plain CSS, no UI libraries
