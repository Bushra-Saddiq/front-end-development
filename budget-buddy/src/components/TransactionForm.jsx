import { useEffect, useState } from 'react'
import { CATEGORIES, useBudget } from '../context/BudgetContext.jsx'

// Today's date as "YYYY-MM-DD", using the local time zone.
function todayString() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

// One form for both adding and editing. When `editing` is set, the form
// fills itself with that transaction and saves over it instead.
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

  function handleTypeChange(newType) {
    setType(newType)
    // Income has no budget category, expenses always need one.
    setCategory(newType === 'income' ? 'Income' : 'Food')
  }

  function resetForm() {
    setDescription('')
    setAmount('')
    setType('expense')
    setCategory('Food')
    setDate(todayString())
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (description.trim() === '') {
      setError('Please write a short description.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter an amount above zero.')
      return
    }

    const transaction = {
      id: editing ? editing.id : undefined,
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    }

    if (editing) {
      updateTransaction(transaction)
    } else {
      addTransaction(transaction)
    }

    resetForm()
    onDone()
  }

  function handleCancel() {
    resetForm()
    onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit transaction' : 'Add a transaction'}</h2>
      <div className="form-grid">
        <label className="field field-wide">
          Description
          <input
            type="text"
            placeholder="e.g. Weekly groceries"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label className="field">
          Amount (Rs)
          <input
            type="number"
            min="0"
            placeholder="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <label className="field">
          Type
          <select value={type} onChange={(event) => handleTypeChange(event.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label className="field">
          Category
          {type === 'income' ? (
            <input type="text" value="Income" disabled />
          ) : (
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </label>
        <label className="field">
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editing ? 'Save changes' : 'Add transaction'}
        </button>
        {editing && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
