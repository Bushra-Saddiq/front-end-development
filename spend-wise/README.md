# SpendWise – Daily Expense Splitter

A small React app for friends or roommates who share expenses. Add the people,
record what was spent, and the app works out who owes whom — including a simple
"who pays whom" list so everyone can settle up with as few payments as possible.

## Features

- Add and remove participants (removal is blocked while a person is part of an
  expense, so nothing points at a missing person)
- Record an expense with a description, an amount in rupees, who paid, and who
  shared it
- Each expense is split equally among the people who shared it
- Total spending shown at the top
- Per-person balances: how much each person paid, their share, and whether they
  are owed money or owe money
- A settlement list that matches the biggest debtor with the biggest creditor
  first, so settling up takes the fewest payments
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
- `useMemo` — total spending, per-person balances, and the settlement list are
  derived from the expenses, so they can never go out of sync
- Props — the App holds the state and passes data and callbacks down to small
  components
- Forms — controlled inputs, checkboxes, and a select for who paid
- Array methods — `map`, `filter`, and `reduce` to build lists, totals, and
  balances
- Conditional rendering — empty states, validation messages, and
  "is owed / owes / settled up"
- localStorage — lazy `useState` initializer to load saved data, `useEffect`
  to save it

## Tech

- Vite + React 19
- Plain CSS, no UI libraries
- Amounts are in Pakistani rupees (Rs)
