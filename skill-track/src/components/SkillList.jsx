import SkillCard from './SkillCard.jsx'

// Renders the list of skills. When the list is empty
// (after filtering, or before any skill is added) it shows
// a friendly message instead of a blank page.
function SkillList({ skills, onUpdateProgress, onToggleComplete, onDelete }) {
  if (skills.length === 0) {
    return (
      <p className="empty-message">
        No skills match this filter yet. Try another filter, or add a new
        skill above.
      </p>
    )
  }

  return (
    <ul className="skill-list">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onUpdateProgress={onUpdateProgress}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default SkillList
