import { useState } from 'react';
// One form for adding a question and for editing one.
// Pass initialQuestion to edit, or leave it out to add a new question.
export default function QuestionForm({ initialQuestion, onSave, onCancel }) {
  const [text, setText] = useState(initialQuestion ? initialQuestion.text : '');
  const [options, setOptions] = useState(initialQuestion ? [...initialQuestion.options] : ['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(initialQuestion ? initialQuestion.correctIndex : 0);
  const [error, setError] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    if (!text.trim()) return setError('Write the question first.');
    if (options.some((o) => !o.trim())) return setError('Fill in all four options.');
    onSave({ text: text.trim(), options: options.map((o) => o.trim()), correctIndex });
  }

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <h3>{initialQuestion ? 'Edit question' : 'Add a question'}</h3>
      {error && <p className="error">{error}</p>}
      <div className="form-group"><label>Question<input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. What does HTML stand for?" /></label></div>
      <div className="form-group">
        <label>Options (pick the correct one)</label>
        {options.map((option, index) => (
          <div key={index} className="option-row">
            <input type="text" value={option} onChange={(e) => { const next = [...options]; next[index] = e.target.value; setOptions(next); }} placeholder={'Option ' + (index + 1)} />
            <label className="radio-label"><input type="radio" name="correct-option" checked={correctIndex === index} onChange={() => setCorrectIndex(index)} /> Correct</label>
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{initialQuestion ? 'Save question' : 'Add question'}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
