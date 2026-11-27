// The end screen: the score, then a full review of every question.
export default function ResultsReview({ result, onPlayAgain, onBackToList }) {
  const percentage = Math.round((result.score / result.total) * 100);
  let message = 'Keep practising — review the answers below and try again.';
  if (percentage >= 80) message = 'Excellent work!';
  else if (percentage >= 50) message = 'Good effort — review the ones you missed below.';
  return (
    <div>
      <div className="card score-box">
        <h2>Your score</h2>
        <p className="score-big">{result.score} out of {result.total}</p>
        <p className="muted">{percentage}% · {message}</p>
        <p className="muted small">{result.quizTitle} · {result.category}</p>
      </div>
      <h2>Review</h2>
      {result.playQuestions.map((question, index) => {
        // Find what the user picked for this question, if anything.
        // No answer happens when the timer ran out mid-quiz.
        const answer = result.answers.find((a) => a.questionId === question.id);
        const chosen = answer ? answer.chosenIndex : null;
        const isCorrect = chosen === question.correctIndex;
        return (
          <article key={question.id} className={'review-item ' + (isCorrect ? 'correct' : 'wrong')}>
            <p><strong>{index + 1}. {question.text}</strong></p>
            <p>Your answer: {chosen === null ? 'Not answered' : question.options[chosen]}</p>
            {!isCorrect && <p>Correct answer: {question.options[question.correctIndex]}</p>}
            <p className="small">{isCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
          </article>
        );
      })}
      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={onPlayAgain}>Play again</button>
        <button type="button" className="btn" onClick={onBackToList}>Back to quizzes</button>
      </div>
    </div>
  );
}
