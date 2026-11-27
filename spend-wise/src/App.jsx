import { useEffect, useMemo, useState } from 'react'
import ParticipantForm from './components/ParticipantForm.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import Balances from './components/Balances.jsx'
import { formatRs } from './utils.js'

const PEOPLE_KEY = 'spendwise-people'
const EXPENSES_KEY = 'spendwise-expenses'

// Example data, so the app is alive on first open.
const seedPeople = [
  { id: 'bushra', name: 'Bushra' },
  { id: 'ayesha', name: 'Ayesha' },
  { id: 'sara', name: 'Sara' },
]

const seedExpenses = [
  {
    id: 'exp-1',
    description: 'Weekly groceries',
    amount: 3000,
    paidBy: 'bushra',
    sharedBy: ['bushra', 'ayesha', 'sara'],
  },
  {
    id: 'exp-2',
    description: 'Internet bill',
    amount: 2500,
    paidBy: 'ayesha',
    sharedBy: ['bushra', 'ayesha', 'sara'],
  },
  {
    id: 'exp-3',
    description: 'Chai and snacks',
    amount: 600,
    paidBy: 'sara',
    sharedBy: ['bushra', 'sara'],
  },
]

// Load saved data from localStorage, or fall back to the seed data.
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

// A small unique id for new people and expenses.
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export default function App() {
  // Lazy initializers: the function runs once, on first render, so we only
  // read localStorage a single time instead of on every render.
  const [people, setPeople] = useState(() => loadFromStorage(PEOPLE_KEY, seedPeople))
  const [expenses, setExpenses] = useState(() => loadFromStorage(EXPENSES_KEY, seedExpenses))

  // Save whenever the data changes, so a refresh keeps everything.
  useEffect(() => {
    localStorage.setItem(PEOPLE_KEY, JSON.stringify(people))
  }, [people])

  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
  }, [expenses])

  // Total spending is derived from the expenses, not stored separately.
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  function addPerson(name) {
    setPeople((prev) => [...prev, { id: makeId(), name }])
  }

  // A person cannot be removed while any expense mentions them,
  // otherwise the expense would point at someone who no longer exists.
  function personIsInExpenses(personId) {
    return expenses.some(
      (expense) => expense.paidBy === personId || expense.sharedBy.includes(personId)
    )
  }

  function removePerson(personId) {
    setPeople((prev) => prev.filter((person) => person.id !== personId))
  }

  function addExpense(expense) {
    setExpenses((prev) => [...prev, { id: makeId(), ...expense }])
  }

  function deleteExpense(expenseId) {
    setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>SpendWise</h1>
        <p className="subtitle">
          Split shared expenses with friends and roommates, and see who owes whom.
        </p>
      </header>

      <section className="card total-card">
        <span className="total-label">Total spending</span>
        <span className="total-amount">{formatRs(totalSpent)}</span>
        <span className="total-count">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} shared by{' '}
          {people.length} {people.length === 1 ? 'person' : 'people'}
        </span>
      </section>

      <ParticipantForm
        people={people}
        onAddPerson={addPerson}
        onRemovePerson={removePerson}
        personIsInExpenses={personIsInExpenses}
      />

      <ExpenseForm people={people} onAddExpense={addExpense} />

      <Balances people={people} expenses={expenses} />

      <ExpenseList people={people} expenses={expenses} onDeleteExpense={deleteExpense} />
    </div>
  )
}
