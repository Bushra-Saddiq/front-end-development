import { createContext, useContext, useEffect, useReducer, useState } from 'react'

// The budget categories. Income is handled separately, it has no limit.
export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Fun', 'Shopping', 'Other']

// localStorage keys, so the data survives a page refresh.
const BUDGETS_KEY = 'budgetbuddy-budgets'
const TRANSACTIONS_KEY = 'budgetbuddy-transactions'

// Example data, so the app is alive on first open.
const seedBudgets = {
  Food: 20000,
  Transport: 8000,
  Bills: 15000,
  Fun: 5000,
  Shopping: 10000,
  Other: 5000,
}

const seedTransactions = [
  { id: 't1', description: 'Part-time work', amount: 45000, type: 'income', category: 'Income', date: '2026-11-05' },
  { id: 't2', description: 'Weekly groceries', amount: 6500, type: 'expense', category: 'Food', date: '2026-11-07' },
  { id: 't3', description: 'Bus card top-up', amount: 2000, type: 'expense', category: 'Transport', date: '2026-11-10' },
  { id: 't4', description: 'Electricity bill', amount: 9500, type: 'expense', category: 'Bills', date: '2026-11-15' },
  { id: 't5', description: 'Movie night', amount: 1800, type: 'expense', category: 'Fun', date: '2026-11-21' },
]

// Read one saved value from localStorage, or fall back to the seed data.
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

// A reducer keeps all transaction changes (add / edit / delete) in one place.
function transactionsReducer(transactions, action) {
  switch (action.type) {
    case 'add':
      return [action.transaction, ...transactions]
    case 'update':
      return transactions.map((item) =>
        item.id === action.transaction.id ? action.transaction : item
      )
    case 'delete':
      return transactions.filter((item) => item.id !== action.id)
    default:
      return transactions
  }
}

const BudgetContext = createContext(null)

export function BudgetProvider({ children }) {
  // Lazy initializers: the function runs once, on first render, to load saved data.
  const [budgets, setBudgets] = useState(() => loadFromStorage(BUDGETS_KEY, seedBudgets))
  const [transactions, dispatch] = useReducer(
    transactionsReducer,
    null,
    () => loadFromStorage(TRANSACTIONS_KEY, seedTransactions)
  )

  // Save whenever the data changes.
  useEffect(() => {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  }, [transactions])

  function addTransaction(transaction) {
    // A simple unique id is enough for a small app.
    const withId = { ...transaction, id: `t${Date.now()}` }
    dispatch({ type: 'add', transaction: withId })
  }

  function updateTransaction(transaction) {
    dispatch({ type: 'update', transaction })
  }

  function deleteTransaction(id) {
    dispatch({ type: 'delete', id })
  }

  function setBudget(category, limit) {
    setBudgets((current) => ({ ...current, [category]: limit }))
  }

  const value = {
    budgets,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
  }

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

// Small helper so any component can read the budget data with one line:
// const { transactions, budgets } = useBudget()
export function useBudget() {
  return useContext(BudgetContext)
}

// Format an amount as Pakistani rupees, e.g. "Rs 45,000".
export function formatRs(amount) {
  return `Rs ${Number(amount).toLocaleString('en-US')}`
}
