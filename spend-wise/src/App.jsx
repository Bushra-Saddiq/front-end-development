import { useEffect, useState } from 'react'
import ParticipantForm from './components/ParticipantForm.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import Balances from './components/Balances.jsx'
import { formatRs } from './utils.js'

// Example data, so the app is not empty the first time you open it.
const seedPeople = [
  { id: 'bushra', name: 'Bushra' },
  { id: 'ayesha', name: 'Ayesha' },
  { id: 'sara', name: 'Sara' },
]

const seedExpenses = [
  { id: 'exp-1', description: 'Weekly groceries', amount: 3000, paidBy: 'bushra', sharedBy: ['bushra', 'ayesha', 'sara'] },
  { id: 'exp-2', description: 'Internet bill', amount: 2500, paidBy: 'ayesha', sharedBy: ['bushra', 'ayesha', 'sara'] },
  { id: 'exp-3', description: 'Chai and snacks', amount: 600, paidBy: 'sara', sharedBy: ['bushra', 'sara'] },
]

// Read saved data from localStorage, or use the seed data.
function loadSaved(key, fallback) {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : fallback
}

export default function App() {
  const [people, setPeople] = useState(() => loadSaved('spendwise-people', seedPeople))
  const [expenses, setExpenses] = useState(() => loadSaved('spendwise-expenses', seedExpenses))

  // Save whenever the data changes, so a refresh keeps everything.
  useEffect(() => {
    localStorage.setItem('spendwise-people', JSON.stringify(people))
  }, [people])

  useEffect(() => {
    localStorage.setItem('spendwise-expenses', JSON.stringify(expenses))
  }, [expenses])

  // Total spending, worked out from the expenses each time we render.
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  function addPerson(name) {
    setPeople([...people, { id: Date.now().toString(), name }])
  }

  function removePerson(personId) {
    setPeople(people.filter((person) => person.id !== personId))
  }

  // A person cannot be removed while any expense mentions them.
  function personIsInExpenses(personId) {
    return expenses.some((expense) => expense.paidBy === personId || expense.sharedBy.includes(personId))
  }

  function addExpense(expense) {
    setExpenses([...expenses, { id: Date.now().toString(), ...expense }])
  }

  function deleteExpense(expenseId) {
    setExpenses(expenses.filter((expense) => expense.id !== expenseId))
  }

  return (
    <div className="app">
      <header>
        <h1>SpendWise</h1>
        <p>Split shared expenses with friends, and see who owes whom.</p>
      </header>

      <section className="card total-card">
        <span>Total spending</span>
        <strong>{formatRs(totalSpent)}</strong>
        <span>
          {expenses.length} expenses shared by {people.length} people
        </span>
      </section>

      <ParticipantForm people={people} onAddPerson={addPerson} onRemovePerson={removePerson} personIsInExpenses={personIsInExpenses} />
      <ExpenseForm people={people} onAddExpense={addExpense} />
      <Balances people={people} expenses={expenses} />
      <ExpenseList people={people} expenses={expenses} onDeleteExpense={deleteExpense} />
    </div>
  )
}
