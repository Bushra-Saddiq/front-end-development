import { useState } from 'react';
// One form for both jobs: creating a quiz and editing it.
// Pass initialQuiz to edit, or leave it out to create.
export default function QuizForm({ initialQuiz, onSave, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialQuiz ? initialQuiz.title : '');
  const [category, setCategory] = useState(initialQuiz ? initialQuiz.category : '');
  const [timeLimit, setTimeLimit] = useState(initialQuiz ? initialQuiz.timeLimit : 0);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return setError('Give your quiz a title.');
    onSave({ title: title.trim(), category: category.trim() || 'General', timeLimit: Number(timeLimit) || 0 });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <div className="form-group"><label>Title<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. HTML Basics" /></label></div>
      <div className="form-group"><label>Category<input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web Development" /></label></div>
      <div className="form-group"><label>Timer (seconds)<input type="number" min="0" step="30" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} /></label><p className="help-text">Optional countdown for the whole quiz. 0 means no timer.</p></div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
