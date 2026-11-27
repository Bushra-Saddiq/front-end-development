import { useState } from 'react'
import { CATEGORIES, useBudget } from './context/BudgetContext.jsx'
import BudgetSettings from './components/BudgetSettings.jsx'
import CategoryCard from './components/CategoryCard.jsx'
import CategoryChart from './components/CategoryChart.jsx'
import Summary from './components/Summary.jsx'
import TransactionForm from './components/TransactionForm.jsx'
import TransactionList from './components/TransactionList.jsx'
function thisMonth() {
  const now = new Date()
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
}
export default function App() {
  const { budgets, transactions } = useBudget()
  const [month, setMonth] = useState(thisMonth())
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  // How much was spent in one category during the shown month.
  function spentIn(category) {
    let total = 0
    for (const item of transactions) {
      if (item.type === 'expense' && item.category === category && item.date.startsWith(month)) total += item.amount
    }
    return total
  }

  // The list, filtered by month, category and type, newest first.
  const shown = transactions
    .filter((item) => item.date.startsWith(month) && (categoryFilter === 'All' || item.category === categoryFilter) && (typeFilter === 'all' || item.type === typeFilter))
    .sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div className="app">
      <header className="header">
        <h1>BudgetBuddy</h1>
        <p className="subtitle">Set a monthly limit for each category, track what you spend, and see what is left.</p>
      </header>
      <section className="card">
        <h2>Summary</h2>
        <Summary month={month} />
      </section>
      <section className="card">
        <h2>Spending by category</h2>
        <div className="category-grid">
          {CATEGORIES.map((category) => <CategoryCard key={category} category={category} limit={budgets[category]} spent={spentIn(category)} />)}
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
          <label className="field">Month
            <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
          </label>
          <label className="field">Category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="All">All categories</option><option value="Income">Income</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label className="field">Type
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">Income and expenses</option><option value="income">Income only</option><option value="expense">Expenses only</option></select>
          </label>
        </div>
        <TransactionList transactions={shown} onEdit={setEditing} />
      </section>
      <section className="card">
        <div className="settings-head">
          <h2>Monthly budgets</h2>
          <button type="button" className="btn btn-secondary" onClick={() => setShowSettings(!showSettings)}>{showSettings ? 'Hide settings' : 'Edit limits'}</button>
        </div>
        {showSettings && <BudgetSettings />}
      </section>
    </div>
  )
}
