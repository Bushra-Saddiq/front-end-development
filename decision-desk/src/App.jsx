import { useEffect, useState } from 'react'
import OptionForm from './components/OptionForm.jsx'
import OptionList from './components/OptionList.jsx'
import ComparisonTable from './components/ComparisonTable.jsx'
import DecisionResult from './components/DecisionResult.jsx'
import HistoryList from './components/HistoryList.jsx'

// Example data shown on first open.
const SEED_QUESTION = 'What should I learn next?'
const SEED_OPTIONS = [
  { id: 1, name: 'React', weight: 5 },
  { id: 2, name: 'Python', weight: 3 },
  { id: 3, name: 'UI design', weight: 4 },
]

// Read a saved value from localStorage, or use the fallback.
function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [question, setQuestion] = useState(load('decisiondesk-question', SEED_QUESTION))
  const [options, setOptions] = useState(load('decisiondesk-options', SEED_OPTIONS))
  const [history, setHistory] = useState(load('decisiondesk-history', []))
  const [result, setResult] = useState(null)
  const [editing, setEditing] = useState(null)

  // Save everything to localStorage when it changes.
  useEffect(() => {
    localStorage.setItem('decisiondesk-question', JSON.stringify(question))
    localStorage.setItem('decisiondesk-options', JSON.stringify(options))
    localStorage.setItem('decisiondesk-history', JSON.stringify(history))
  }, [question, options, history])

  function addOption(option) {
    setOptions([...options, option])
  }

  function saveEdit(updated) {
    setOptions(options.map((option) => (option.id === updated.id ? updated : option)))
    setEditing(null)
  }

  function deleteOption(id) {
    setOptions(options.filter((option) => option.id !== id))
    if (editing && editing.id === id) {
      setEditing(null)
    }
  }

  function deleteHistoryEntry(id) {
    setHistory(history.filter((entry) => entry.id !== id))
  }

  // Pick one option at random. A higher weight means a better chance:
  // weight 5 has five times the chance of weight 1.
  function decide() {
    if (options.length === 0) return

    const totalWeight = options.reduce((sum, option) => sum + option.weight, 0)
    let roll = Math.random() * totalWeight
    let picked = options[options.length - 1]
    for (const option of options) {
      roll = roll - option.weight
      if (roll <= 0) {
        picked = option
        break
      }
    }

    const chance = Math.round((picked.weight / totalWeight) * 100)
    setResult({ choice: picked, chance })
    setHistory([
      {
        id: Date.now(),
        question: question.trim() === '' ? 'Untitled decision' : question.trim(),
        choice: picked.name,
        date: new Date().toISOString(),
      },
      ...history,
    ])
  }

  return (
    <main className="page">
      <header className="header">
        <h1>DecisionDesk</h1>
        <p>Stuck between choices? List them, weigh them, and let DecisionDesk pick one for you.</p>
      </header>

      <section className="card">
        <label htmlFor="question">Your question</label>
        <input id="question" type="text" value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What should I learn next?" />
      </section>

      <section className="card">
        <h2>Your options</h2>
        <OptionForm onAdd={addOption} onSaveEdit={saveEdit} onCancelEdit={() => setEditing(null)} editing={editing} />
        <OptionList options={options} onEdit={setEditing} onDelete={deleteOption} />
      </section>

      <section className="card">
        <h2>Compare options</h2>
        {options.length === 0 ? (
          <p>Add at least one option to see the comparison.</p>
        ) : (
          <ComparisonTable options={options} />
        )}
        <button className="btn btn-primary" type="button" onClick={decide} disabled={options.length === 0}>
          Decide for me
        </button>
      </section>

      <DecisionResult result={result} onClear={() => setResult(null)} />

      <section className="card">
        <h2>Decision history</h2>
        <HistoryList history={history} onDelete={deleteHistoryEntry} />
      </section>
    </main>
  )
}
