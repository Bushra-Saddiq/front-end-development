import StatsPanel from './StatsPanel.jsx';

// The home screen: every quiz as a card, with its stats and actions.
export default function QuizList({ quizzes, attempts, onCreate, onPlay, onEdit, onDelete }) {
  if (quizzes.length === 0) {
    return (
      <div className="card empty-state">
        <h2>No quizzes yet</h2>
        <p className="muted">
          Create your first quiz — add questions, then play it and track your
          score over time.
        </p>
        <button type="button" className="btn btn-primary" onClick={onCreate}>
          Create a quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="list-header">
        <h2>Your quizzes</h2>
        <button type="button" className="btn btn-primary" onClick={onCreate}>
          + New quiz
        </button>
      </div>

      {quizzes.map((quiz) => {
        // Only this quiz's attempts count towards its statistics.
        const quizAttempts = attempts.filter(
          (attempt) => attempt.quizId === quiz.id,
        );
        return (
          <article key={quiz.id} className="card quiz-card">
            <div className="quiz-card-top">
              <div>
                <h3>{quiz.title}</h3>
                <p className="muted">
                  {quiz.questions.length} question
                  {quiz.questions.length === 1 ? '' : 's'}
                  {quiz.timeLimit > 0
                    ? ` · ${Math.floor(quiz.timeLimit / 60)} min timer`
                    : ' · No timer'}
                </p>
              </div>
              <span className="badge">{quiz.category}</span>
            </div>

            <StatsPanel
              attempts={quizAttempts}
              total={quiz.questions.length}
            />

            <div className="card-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={quiz.questions.length === 0}
                onClick={() => onPlay(quiz.id)}
              >
                Play
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => onEdit(quiz.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete "${quiz.title}"? This also removes its attempt history.`,
                    )
                  ) {
                    onDelete(quiz.id);
                  }
                }}
              >
                Delete
              </button>
            </div>

            {quiz.questions.length === 0 && (
              <p className="muted small">
                Add questions before you can play this quiz.
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
