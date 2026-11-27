import { useState } from 'react';

// One form for both jobs: creating a quiz and editing its title/category/timer.
// Pass initialQuiz to edit, or leave it out to create.
export default function QuizForm({ initialQuiz, onSave, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialQuiz ? initialQuiz.title : '');
  const [category, setCategory] = useState(
    initialQuiz ? initialQuiz.category : '',
  );
  const [timeLimit, setTimeLimit] = useState(
    initialQuiz ? initialQuiz.timeLimit : 0,
  );
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Give your quiz a title.');
      return;
    }
    onSave({
      title: title.trim(),
      category: category.trim() || 'General',
      // The number input gives a string, so convert it back to a number.
      timeLimit: Number(timeLimit) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label htmlFor="quiz-title">Title</label>
        <input
          id="quiz-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. HTML Basics"
        />
      </div>

      <div className="form-group">
        <label htmlFor="quiz-category">Category</label>
        <input
          id="quiz-category"
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="e.g. Web Development"
        />
      </div>

      <div className="form-group">
        <label htmlFor="quiz-timer">Timer (seconds)</label>
        <input
          id="quiz-timer"
          type="number"
          min="0"
          step="30"
          value={timeLimit}
          onChange={(event) => setTimeLimit(event.target.value)}
        />
        <p className="help-text">
          Optional countdown for the whole quiz. 0 means no timer.
        </p>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
