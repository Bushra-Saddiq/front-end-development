import { useState } from 'react'

// The form for adding a new skill.
// It is a controlled form: every input value lives in state,
// so React always knows what the user typed.
function SkillForm({ categories, onAddSkill }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    // A skill needs a name; the goal is optional.
    if (name.trim() === '') {
      setError('Please give your skill a name.')
      return
    }

    onAddSkill({
      name: name.trim(),
      category: category,
      goal: goal.trim(),
    })

    // Clear the form so the next skill is quick to add.
    setName('')
    setCategory(categories[0])
    setGoal('')
    setError('')
  }

  return (
    <section className="card">
      <h2 className="section-title">Add a new skill</h2>
      <form className="skill-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="skill-name">Skill name</label>
            <input
              id="skill-name"
              type="text"
              placeholder="e.g. React"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="skill-category">Category</label>
            <select
              id="skill-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="skill-goal">Learning goal</label>
          <input
            id="skill-goal"
            type="text"
            placeholder="e.g. Build 3 small projects"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
          />
        </div>
        {error !== '' && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" type="submit">
          Add skill
        </button>
      </form>
    </section>
  )
}

export default SkillForm
