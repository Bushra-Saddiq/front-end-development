import { useState } from 'react'
import { CATEGORIES, useBudget } from '../context/BudgetContext.jsx'
// Edit the monthly spending limit for each category.
export default function BudgetSettings() {
  const { budgets, setBudget } = useBudget()
  const [limits, setLimits] = useState(budgets)
  const [saved, setSaved] = useState(false)
  function handleSave(event) {
    event.preventDefault()
    for (const category of CATEGORIES) {
      setBudget(category, Math.max(0, Number(limits[category]) || 0))
    }
    setSaved(true)
  }
  return (
    <form onSubmit={handleSave}>
      <p className="muted">Set how much you plan to spend in each category this month.</p>
      <div className="form-grid">
        {CATEGORIES.map((category) => (
          <label key={category} className="field">{category} (Rs)
            <input type="number" min="0" value={limits[category]} onChange={(event) => { setLimits({ ...limits, [category]: event.target.value }); setSaved(false) }} />
          </label>
        ))}
      </div>
      <button type="submit" className="btn btn-primary">Save limits</button>
      {saved && <span className="saved-note">Saved!</span>}
    </form>
  )
}
