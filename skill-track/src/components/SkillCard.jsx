// One skill, shown as a card. The same component is reused
// for every skill in the list.
function SkillCard({ skill, onUpdateProgress, onToggleComplete, onDelete }) {
  return (
    <li className={skill.completed ? 'skill-card completed' : 'skill-card'}>
      <div className="skill-card-top">
        <div>
          <h3>{skill.name}</h3>
          <p className="skill-goal">{skill.goal === '' ? 'No goal set yet.' : skill.goal}</p>
        </div>
        <span className="category-tag">{skill.category}</span>
      </div>

      <div className="progress-row">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: skill.progress + '%' }} />
        </div>
        <span className="progress-text">{skill.progress}%</span>
      </div>

      <div className="skill-actions">
        <button className="btn btn-small" type="button" onClick={() => onUpdateProgress(skill.id, -10)}>-10</button>
        <button className="btn btn-small" type="button" onClick={() => onUpdateProgress(skill.id, 10)}>+10</button>
        <button className="btn btn-small" type="button" onClick={() => onToggleComplete(skill.id)}>
          {skill.completed ? 'Mark as learning' : 'Mark as completed'}
        </button>
        <span className="spacer" />
        {skill.completed && <span className="completed-badge">Completed</span>}
        <button className="btn btn-small btn-danger" type="button" onClick={() => onDelete(skill.id)}>Delete</button>
      </div>
    </li>
  )
}

export default SkillCard
