# DecisionDesk – Smart Decision Maker

Stuck between choices? DecisionDesk helps you decide. Type your question,
add your options, give each one a priority from 1 to 5, and let the app pick
one for you. Higher-priority options have a better chance of winning.

## Features

- Ask any question, like "What should I learn next?"
- Add options with a priority weight (1 = low, 5 = high)
- Edit or delete options
- "Decide for me" picks one option at random, weighted by priority, and
  explains why it won
- Compare all options side by side in a table with their chance of winning
- Every decision is saved automatically to a history list with the question,
  the chosen option and the date
- Delete entries from the history
- Everything is saved in your browser (localStorage), so your options and
  history are still there when you come back

## How to run

```bash
npm install
npm run dev
```

Then open the address shown in the terminal (usually
http://localhost:5173).

To make a production build:

```bash
npm run build
npm run preview
```

## React concepts practiced

- `useState` for the question, options, result and history
- `useEffect` for saving to localStorage
- `useMemo` for the total weight used in the chance calculation
- `useRef` for focusing the option input after adding an option
- `props` for passing data and callbacks into components
- Controlled forms for the question and the option form
- Conditional rendering (empty states, the result card, the edit form)
- Array methods: `map`, `filter`, `reduce`, `sort`
- `localStorage` for saving data between visits

## Built with

- [Vite](https://vite.dev/) + React 19
- Plain CSS, no UI libraries
