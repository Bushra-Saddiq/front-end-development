import { useEffect, useMemo, useRef, useState } from 'react'
import OptionForm from './components/OptionForm.jsx'
import OptionList from './components/OptionList.jsx'
import ComparisonTable from './components/ComparisonTable.jsx'
import DecisionResult from './components/DecisionResult.jsx'
import HistoryList from './components/HistoryList.jsx'

// Example data shown on first open, so the app is alive straight away.
const SEED_QUESTION = 'What should I learn next?'
const SEED_OPTIONS = [
  { id: 1, name: 'React', weight: 5 },
  { id: 2, name: 'Python', weight: 3 },
  { id: 3, name: 'UI design', weight: 4 },
]

// Read a value from localStorage, or fall back to the seed data
// when there is nothing saved yet.
function loadSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  // Lazy initializers: the function runs once, on the first render,
  // so we only read localStorage once instead of on every render.
  const [question, setQuestion] = useState(() =>
    loadSaved('decisiondesk-question', SEED_QUESTION),
  )
  const [options, setOptions] = useState(() =>
    loadSaved('decisiondesk-options', SEED_OPTIONS),
  )
  const [history, setHistory] = useState(() =>
    loadSaved('decisiondesk-history', []),
  )

  const [result, setResult] = useState(null)
  const [editing, setEditing] = useState(null)

  // Used to focus the option name field after an option is added.
  const nameInputRef = useRef(null)

  // Save each piece of state whenever it changes.
  useEffect(() => {
    localStorage.setItem('decisiondesk-question', JSON.stringify(question))
  }, [question])

  useEffect(() => {
    localStorage.setItem('decisiondesk-options', JSON.stringify(options))
  }, [options])

  useEffect(() => {
    localStorage.setItem('decisiondesk-history', JSON.stringify(history))
  }, [history])

  // The total of all weights. useMemo keeps this from being
  // recalculated on renders where the options did not change.
  const totalWeight = useMemo(
    () => options.reduce((sum, option) => sum + option.weight, 0),
    [options],
  )

  function addOption(option) {
    setOptions((current) => [...current, option])
  }

  function saveEdit(updated) {
    setOptions((current) =>
      current.map((option) => (option.id === updated.id ? updated : option)),
    )
    setEditing(null)
  }

  function deleteOption(id) {
    setOptions((current) => current.filter((option) => option.id !== id))
    // If the option being edited is deleted, close the edit form.
    setEditing((current) => (current?.id === id ? null : current))
  }

  function deleteHistoryEntry(id) {
    setHistory((current) => current.filter((entry) => entry.id !== id))
  }

  // Pick one option at random, weighted by priority: an option with
  // weight 5 has five times the chance of an option with weight 1.
  function decide() {
    if (options.length === 0 || totalWeight === 0) return

    let roll = Math.random() * totalWeight
    let picked = options[options.length - 1]
    for (const option of options) {
      roll -= option.weight
      if (roll <= 0) {
        picked = option
        break
      }
    }

    const chance = Math.round((picked.weight / totalWeight) * 100)
    setResult({ choice: picked, chance })

    // Every decision is saved automatically, newest first.
    setHistory((current) => [
      {
        id: Date.now(),
        question: question.trim() || 'Untitled decision',
        choice: picked.name,
        date: new Date().toISOString(),
      },
      ...current,
    ])
  }

  return (
    <main className="page">
      <header className="header">
        <h1>DecisionDesk</h1>
        <p className="tagline">
          Stuck between choices? List them, weigh them, and let DecisionDesk
          pick one for you.
        </p>
      </header>

      <section className="card">
        <label htmlFor="question">Your question</label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What should I learn next?"
        />
      </section>

      <section className="card">
        <h2>Your options</h2>
        <OptionForm
          onAdd={addOption}
          onSaveEdit={saveEdit}
          onCancelEdit={() => setEditing(null)}
          editing={editing}
          inputRef={nameInputRef}
        />
        <OptionList
          options={options}
          onEdit={setEditing}
          onDelete={deleteOption}
        />
      </section>

      <section className="card">
        <h2>Compare options</h2>
        {options.length === 0 ? (
          <p className="empty-note">
            Add at least one option to see the comparison.
          </p>
        ) : (
          <ComparisonTable options={options} />
        )}
        <button
          className="btn btn-primary btn-big"
          type="button"
          onClick={decide}
          disabled={options.length === 0}
        >
          Decide for me
        </button>
      </section>

      <DecisionResult result={result} onClear={() => setResult(null)} />

      <section className="card">
        <h2>Decision history</h2>
        <HistoryList history={history} onDelete={deleteHistoryEntry} />
      </section>

      <footer className="footer">
        Your question, options and history are saved in this browser.
      </footer>
    </main>
  )
}
