import { useEffect, useState } from 'react'
import SkillForm from './components/SkillForm.jsx'
import SkillList from './components/SkillList.jsx'
import StatsBar from './components/StatsBar.jsx'
import FilterBar from './components/FilterBar.jsx'

// Saved under this key, so the list is still there
// after the page is closed and reopened.
const STORAGE_KEY = 'skilltrack-skills'

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Design', 'Other']

// Example skills, shown the first time the app opens.
const SEED_SKILLS = [
  { id: 'seed-react', name: 'React', category: 'Frontend',
    goal: 'Build 3 small projects', progress: 40, completed: false },
  { id: 'seed-javascript', name: 'JavaScript', category: 'Frontend',
    goal: 'Finish the basics course', progress: 65, completed: false },
  { id: 'seed-python', name: 'Python', category: 'Backend',
    goal: 'Automate one daily task', progress: 20, completed: false },
  { id: 'seed-figma', name: 'Figma', category: 'Design',
    goal: 'Redesign my portfolio', progress: 80, completed: false },
]

// Read the saved skills, or use the examples
// if there is nothing saved yet.
function loadSkills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    // Broken saved data: fall back to the examples.
  }
  return SEED_SKILLS
}

function App() {
  const [skills, setSkills] = useState(loadSkills)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('highest')

  // Save the skills every time they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(skills))
  }, [skills])

  function addSkill({ name, category, goal }) {
    const newSkill = {
      id: 'skill-' + Date.now(),
      name: name,
      category: category,
      goal: goal,
      progress: 0,
      completed: false,
    }
    setSkills([...skills, newSkill])
  }

  // Move progress up or down by 10, keeping it between 0 and 100.
  // Reaching 100 completes the skill.
  function updateProgress(id, change) {
    setSkills(skills.map((skill) => {
      if (skill.id !== id) {
        return skill
      }
      const nextProgress = Math.min(100, Math.max(0, skill.progress + change))
      return { ...skill, progress: nextProgress, completed: nextProgress === 100 }
    }))
  }

  // Flip the completed checkbox. The progress stays as it is.
  function toggleComplete(id) {
    setSkills(skills.map((skill) => {
      if (skill.id !== id) {
        return skill
      }
      return { ...skill, completed: !skill.completed }
    }))
  }

  function deleteSkill(id) {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  // The three numbers at the top.
  const total = skills.length
  const completedCount = skills.filter((skill) => skill.completed).length
  const averageProgress = total === 0
    ? 0
    : Math.round(skills.reduce((sum, skill) => sum + skill.progress, 0) / total)

  // The list the user sees: first filtered, then sorted by progress.
  // filter() makes a new array, so sorting it does not
  // change the skills in state.
  const visibleSkills = skills.filter((skill) => {
    const matchesCategory = categoryFilter === 'All' || skill.category === categoryFilter
    const matchesStatus = statusFilter === 'All'
      || (statusFilter === 'Completed' && skill.completed)
      || (statusFilter === 'In progress' && !skill.completed)
    return matchesCategory && matchesStatus
  })
  if (sortOrder === 'highest') {
    visibleSkills.sort((a, b) => b.progress - a.progress)
  } else {
    visibleSkills.sort((a, b) => a.progress - b.progress)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>SkillTrack</h1>
        <p>Track what you are learning, and watch the progress add up.</p>
      </header>

      <StatsBar total={total} completed={completedCount} averageProgress={averageProgress} />

      <SkillForm categories={CATEGORIES} onAddSkill={addSkill} />

      <FilterBar
        categories={CATEGORIES}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <SkillList skills={visibleSkills} onUpdateProgress={updateProgress} onToggleComplete={toggleComplete} onDelete={deleteSkill} />

      <footer className="app-footer">
        Your skills are saved in this browser, so they will still be here next time.
      </footer>
    </div>
  )
}

export default App
