import { useMemo, useState } from 'react'
import { CATEGORIES, useBudget } from './context/BudgetContext.jsx'
import BudgetSettings from './components/BudgetSettings.jsx'
import CategoryCard from './components/CategoryCard.jsx'
import CategoryChart from './components/CategoryChart.jsx'
import Summary from './components/Summary.jsx'
import TransactionForm from './components/TransactionForm.jsx'
import TransactionList from './components/TransactionList.jsx'

// The current month as "YYYY-MM", used as the default filter.
function currentMonthString() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

// A readable month name, e.g. "November 2026".
function monthLabel(monthString) {
  const [year, month] = monthString.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function App() {
  const { budgets, transactions } = useBudget()

  const [month, setMonth] = useState(currentMonthString())
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  // How much was spent per category in the shown month.
  const spentByCategory = useMemo(() => {
    const totals = {}
    CATEGORIES.forEach((category) => {
      totals[category] = transactions
        .filter(
          (item) =>
            item.type === 'expense' &&
            item.category === category &&
            item.date.startsWith(month)
        )
        .reduce((sum, item) => sum + item.amount, 0)
    })
    return totals
  }, [transactions, month])

  // The list, filtered by month / category / type and newest first.
  const visibleTransactions = useMemo(() => {
    const filtered = transactions.filter((item) => {
      const inMonth = item.date.startsWith(month)
      const inCategory = categoryFilter === 'All' || item.category === categoryFilter
      const inType = typeFilter === 'all' || item.type === typeFilter
      return inMonth && inCategory && inType
    })
    return [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, month, categoryFilter, typeFilter])

  return (
    <div className="app">
      <header className="header">
        <h1>BudgetBuddy</h1>
        <p className="subtitle">
          Set a monthly limit for each category, track what you spend, and see what is left.
        </p>
      </header>

      <section className="card">
        <h2>{monthLabel(month)}</h2>
        <Summary month={month} />
      </section>

      <section className="card">
        <h2>Spending by category</h2>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              limit={budgets[category]}
              spent={spentByCategory[category]}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Where the money went</h2>
        <CategoryChart month={month} />
      </section>

      <section className="card">
        <TransactionForm editing={editing} onDone={() => setEditing(null)} />
      </section>

      <section className="card">
        <h2>Transactions</h2>
        <div className="filters">
          <label className="field">
            Month
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
          </label>
          <label className="field">
            Category
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="All">All categories</option>
              <option value="Income">Income</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Type
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">Income and expenses</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
            </select>
          </label>
        </div>
        <TransactionList transactions={visibleTransactions} onEdit={setEditing} />
      </section>

      <section className="card">
        <div className="settings-head">
          <h2>Monthly budgets</h2>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowSettings((show) => !show)}
          >
            {showSettings ? 'Hide settings' : 'Edit limits'}
          </button>
        </div>
        {showSettings && <BudgetSettings />}
      </section>

      <footer className="footer">
        <p className="muted">Your budgets and transactions are saved in this browser.</p>
      </footer>
    </div>
  )
}
