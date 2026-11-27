import { useState } from 'react'
import { CATEGORIES, formatRs, useBudget } from '../context/BudgetContext.jsx'

// Edit the monthly spending limit for each category.
export default function BudgetSettings() {
  const { budgets, setBudget } = useBudget()
  const [limits, setLimits] = useState(budgets)
  const [saved, setSaved] = useState(false)

  function handleChange(category, value) {
    setLimits((current) => ({ ...current, [category]: value }))
    setSaved(false)
  }

  function handleSave(event) {
    event.preventDefault()
    CATEGORIES.forEach((category) => {
      // Empty or negative input becomes 0, so the math never breaks.
      const limit = Math.max(0, Number(limits[category]) || 0)
      setBudget(category, limit)
    })
    setSaved(true)
  }

  return (
    <form onSubmit={handleSave}>
      <p className="muted">
        Set how much you plan to spend in each category this month. The progress bars
        and warnings use these limits.
      </p>
      <div className="form-grid">
        {CATEGORIES.map((category) => (
          <label key={category} className="field">
            {category} (Rs)
            <input
              type="number"
              min="0"
              value={limits[category]}
              onChange={(event) => handleChange(category, event.target.value)}
            />
          </label>
        ))}
      </div>
      <button type="submit" className="btn btn-primary">
        Save limits
      </button>
      {saved && <span className="saved-note">Limits saved. Total: {formatRs(CATEGORIES.reduce((sum, c) => sum + Number(limits[c] || 0), 0))} / month</span>}
    </form>
  )
}
