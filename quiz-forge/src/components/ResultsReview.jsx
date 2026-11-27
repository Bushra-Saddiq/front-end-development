// The end screen: the score, then a full review of every question.
export default function ResultsReview({ result, onPlayAgain, onBackToList }) {
  const percentage = Math.round((result.score / result.total) * 100);
  const message =
    percentage >= 80
      ? 'Excellent work!'
      : percentage >= 50
        ? 'Good effort — review the ones you missed below.'
        : 'Keep practising — review the answers below and try again.';

  return (
    <div>
      <div className="card score-box">
        <h2>Your score</h2>
        <p className="score-big">
          {result.score} out of {result.total}
        </p>
        <p className="muted">
          {percentage}% · {message}
        </p>
        <p className="muted small">
          {result.quizTitle} · {result.category}
        </p>
      </div>

      <h2>Review</h2>
      {result.playQuestions.map((question, index) => {
        // Find what the user picked for this question, if anything.
        // (No answer happens when the timer ran out mid-quiz.)
        const answer = result.answers.find((a) => a.questionId === question.id);
        const chosenIndex = answer ? answer.chosenIndex : null;
        const isCorrect = chosenIndex === question.correctIndex;

        return (
          <article
            key={question.id}
            className={`review-item ${isCorrect ? 'correct' : 'wrong'}`}
          >
            <p>
              <strong>
                {index + 1}. {question.text}
              </strong>
            </p>
            <p>
              Your answer:{' '}
              {chosenIndex === null ? 'Not answered' : question.options[chosenIndex]}
            </p>
            {!isCorrect && (
              <p>Correct answer: {question.options[question.correctIndex]}</p>
            )}
            <p className="small">{isCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
          </article>
        );
      })}

      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
          Play again
        </button>
        <button type="button" className="btn" onClick={onBackToList}>
          Back to quizzes
        </button>
      </div>
    </div>
  );
}
