import { useEffect, useState } from 'react'
import { CATEGORIES, useBudget } from '../context/BudgetContext.jsx'
// Today's date as "YYYY-MM-DD".
function todayString() {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

// One form for adding and editing. When `editing` is set, it fills
// itself with that transaction and saves over it instead.
export default function TransactionForm({ editing, onDone }) {
  const { addTransaction, updateTransaction } = useBudget()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(todayString())
  const [error, setError] = useState('')

  // When the user picks a transaction to edit, fill the form with it.
  useEffect(() => {
    if (editing) {
      setDescription(editing.description)
      setAmount(String(editing.amount))
      setType(editing.type)
      setCategory(editing.category)
      setDate(editing.date)
    }
  }, [editing])

  function reset() {
    setDescription('')
    setAmount('')
    setType('expense')
    setCategory('Food')
    setDate(todayString())
    setError('')
    onDone()
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (description.trim() === '') return setError('Please write a short description.')
    if (!amount || Number(amount) <= 0) return setError('Please enter an amount above zero.')
    const item = { id: editing ? editing.id : undefined, description: description.trim(), amount: Number(amount), type, category, date }
    if (editing) updateTransaction(item)
    else addTransaction(item)
    reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit transaction' : 'Add a transaction'}</h2>
      <div className="form-grid">
        <label className="field">Description
          <input type="text" placeholder="e.g. Weekly groceries" value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="field">Amount (Rs)
          <input type="number" min="0" placeholder="0" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
        <label className="field">Type
          <select value={type} onChange={(event) => { setType(event.target.value); setCategory(event.target.value === 'income' ? 'Income' : 'Food') }}><option value="expense">Expense</option><option value="income">Income</option></select>
        </label>
        <label className="field">Category
          {type === 'income' ? <input type="text" value="Income" disabled /> : <select value={category} onChange={(event) => setCategory(event.target.value)}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>}</label>
        <label className="field">Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-primary">{editing ? 'Save changes' : 'Add transaction'}</button>
      {editing && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
    </form>
  )
}
