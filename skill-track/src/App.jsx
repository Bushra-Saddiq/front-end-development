import { useEffect, useMemo, useState } from 'react'
import SkillForm from './components/SkillForm.jsx'
import SkillList from './components/SkillList.jsx'
import StatsBar from './components/StatsBar.jsx'
import FilterBar from './components/FilterBar.jsx'

// Where skills are saved in the browser, so the list
// is still there after the page is closed and reopened.
const STORAGE_KEY = 'skilltrack-skills'

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Design', 'Other']

// Example skills, so the app feels alive the first time it opens.
// They are only used when nothing is saved in localStorage yet.
const SEED_SKILLS = [
  {
    id: 'seed-react',
    name: 'React',
    category: 'Frontend',
    goal: 'Build 3 small projects',
    progress: 40,
    completed: false,
    createdAt: 1,
  },
  {
    id: 'seed-javascript',
    name: 'JavaScript',
    category: 'Frontend',
    goal: 'Finish the basics course',
    progress: 65,
    completed: false,
    createdAt: 2,
  },
  {
    id: 'seed-python',
    name: 'Python',
    category: 'Backend',
    goal: 'Automate one daily task',
    progress: 20,
    completed: false,
    createdAt: 3,
  },
  {
    id: 'seed-figma',
    name: 'Figma',
    category: 'Design',
    goal: 'Redesign my portfolio',
    progress: 80,
    completed: false,
    createdAt: 4,
  },
]

// Load the saved skills. The function form of useState runs only
// once, when the component first mounts, so we read localStorage
// a single time instead of on every render.
function loadSkills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    // If the saved data is broken, fall back to the seed skills.
    console.warn('Could not load saved skills, using examples instead.', error)
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
      createdAt: Date.now(),
    }
    setSkills((currentSkills) => [...currentSkills, newSkill])
  }

  // Move progress up or down by a step, keeping it between 0 and 100.
  // Reaching 100 completes the skill; dropping below 100 reopens it.
  function updateProgress(id, change) {
    setSkills((currentSkills) =>
      currentSkills.map((skill) => {
        if (skill.id !== id) {
          return skill
        }
        const nextProgress = Math.min(
          100,
          Math.max(0, skill.progress + change),
        )
        return {
          ...skill,
          progress: nextProgress,
          completed: nextProgress === 100,
        }
      }),
    )
  }

  // The manual toggle: completing sets progress to 100, and
  // un-completing drops it back to 90 so the skill reads as
  // in progress again instead of sitting at a full bar.
  function toggleComplete(id) {
    setSkills((currentSkills) =>
      currentSkills.map((skill) => {
        if (skill.id !== id) {
          return skill
        }
        if (skill.completed) {
          return { ...skill, completed: false, progress: 90 }
        }
        return { ...skill, completed: true, progress: 100 }
      }),
    )
  }

  function deleteSkill(id) {
    setSkills((currentSkills) =>
      currentSkills.filter((skill) => skill.id !== id),
    )
  }

  // The list the user actually sees: filtered by category and
  // status, then sorted. useMemo recomputes it only when the
  // skills or the filters change, not on every render.
  const visibleSkills = useMemo(() => {
    const filtered = skills.filter((skill) => {
      const matchesCategory =
        categoryFilter === 'All' || skill.category === categoryFilter
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && skill.completed) ||
        (statusFilter === 'In progress' && !skill.completed)
      return matchesCategory && matchesStatus
    })

    const sorted = [...filtered]
    if (sortOrder === 'highest') {
      sorted.sort((a, b) => b.progress - a.progress)
    } else if (sortOrder === 'lowest') {
      sorted.sort((a, b) => a.progress - b.progress)
    } else {
      sorted.sort((a, b) => b.createdAt - a.createdAt)
    }
    return sorted
  }, [skills, categoryFilter, statusFilter, sortOrder])

  // The three numbers at the top, recomputed when skills change.
  const stats = useMemo(() => {
    const total = skills.length
    const completed = skills.filter((skill) => skill.completed).length
    const averageProgress =
      total === 0
        ? 0
        : Math.round(
            skills.reduce((sum, skill) => sum + skill.progress, 0) / total,
          )
    return { total, completed, averageProgress }
  }, [skills])

  return (
    <div className="app">
      <header className="app-header">
        <h1>SkillTrack</h1>
        <p>Track what you are learning, and watch the progress add up.</p>
      </header>

      <StatsBar
        total={stats.total}
        completed={stats.completed}
        averageProgress={stats.averageProgress}
      />

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

      <SkillList
        skills={visibleSkills}
        onUpdateProgress={updateProgress}
        onToggleComplete={toggleComplete}
        onDelete={deleteSkill}
      />

      <footer className="app-footer">
        Your skills are saved in this browser, so they will still be here
        next time.
      </footer>
    </div>
  )
}

export default App
