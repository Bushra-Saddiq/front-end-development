import { createContext, useContext, useEffect, useState } from 'react'
// The budget categories. Income has no limit, so it is not listed here.
export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Fun', 'Shopping', 'Other']

const seedBudgets = { Food: 20000, Transport: 8000, Bills: 15000, Fun: 5000, Shopping: 10000, Other: 5000 }

const seedTransactions = [
  { id: 1, description: 'Part-time work', amount: 45000, type: 'income', category: 'Income', date: '2026-11-05' },
  { id: 2, description: 'Weekly groceries', amount: 6500, type: 'expense', category: 'Food', date: '2026-11-07' },
  { id: 3, description: 'Bus card top-up', amount: 2000, type: 'expense', category: 'Transport', date: '2026-11-10' },
  { id: 4, description: 'Electricity bill', amount: 9500, type: 'expense', category: 'Bills', date: '2026-11-15' },
  { id: 5, description: 'Movie night', amount: 1800, type: 'expense', category: 'Fun', date: '2026-11-21' },
]

const BudgetContext = createContext(null)

export function BudgetProvider({ children }) {
  // Load saved data from localStorage, or use the seed data on first open.
  const [budgets, setBudgets] = useState(() => JSON.parse(localStorage.getItem('budgetbuddy-budgets')) || seedBudgets)
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('budgetbuddy-transactions')) || seedTransactions)
  // Save whenever the data changes.
  useEffect(() => {
    localStorage.setItem('budgetbuddy-budgets', JSON.stringify(budgets))
    localStorage.setItem('budgetbuddy-transactions', JSON.stringify(transactions))
  }, [budgets, transactions])

  function addTransaction(item) { setTransactions([{ ...item, id: Date.now() }, ...transactions]) }
  function updateTransaction(item) { setTransactions(transactions.map((t) => (t.id === item.id ? item : t))) }
  function deleteTransaction(id) { setTransactions(transactions.filter((t) => t.id !== id)) }
  function setBudget(category, limit) { setBudgets({ ...budgets, [category]: limit }) }

  const value = { budgets, transactions, addTransaction, updateTransaction, deleteTransaction, setBudget }
  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

// One line to read the data in any component: const { transactions } = useBudget()
export function useBudget() {
  return useContext(BudgetContext)
}

// Format an amount as rupees, e.g. "Rs 45,000".
export function formatRs(amount) {
  return 'Rs ' + Number(amount).toLocaleString('en-US')
}
