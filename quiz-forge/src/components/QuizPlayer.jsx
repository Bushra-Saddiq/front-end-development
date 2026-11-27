import { useState, useEffect } from 'react';
// Shuffle (Fisher-Yates): copy the array, then walk backwards swapping each item with a random earlier one.
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
// Shuffle the questions and the options inside each one. The correct answer is found again by matching its text.
function buildPlayQuestions(questions) {
  return shuffle(questions).map((q) => {
    const options = shuffle(q.options);
    return { ...q, options, correctIndex: options.indexOf(q.options[q.correctIndex]) };
  });
}

const formatTime = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

export default function QuizPlayer({ quiz, onFinish, onQuit }) {
  // The shuffled questions are built once, when the quiz starts.
  const [playQuestions] = useState(() => buildPlayQuestions(quiz.questions));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const total = playQuestions.length;
  const current = playQuestions[index];
  const isLast = index === total - 1;

  // Countdown, only when the quiz has a timer.
  useEffect(() => {
    if (quiz.timeLimit === 0) return;
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [quiz.timeLimit]);

  // Time ran out: submit what has been answered so far.
  useEffect(() => {
    if (quiz.timeLimit > 0 && timeLeft === 0) finishQuiz();
  }, [timeLeft]);

  function finishQuiz() {
    const allAnswers = selected === null ? answers : [...answers, { questionId: current.id, chosenIndex: selected }];
    let score = 0;
    allAnswers.forEach((a) => {
      const q = playQuestions.find((item) => item.id === a.questionId);
      if (q && a.chosenIndex === q.correctIndex) score++;
    });
    onFinish({ quizId: quiz.id, quizTitle: quiz.title, category: quiz.category, score, total, playQuestions, answers: allAnswers });
  }

  function handleNext() {
    if (selected === null) return;
    if (isLast) return finishQuiz();
    setAnswers([...answers, { questionId: current.id, chosenIndex: selected }]); setIndex(index + 1); setSelected(null);
  }

  return (
    <div className="card">
      <div className="player-top">
        <div><h2>{quiz.title}</h2><p className="muted">Question {index + 1} of {total}</p></div>
        {quiz.timeLimit > 0 && <p className={timeLeft <= 30 ? 'timer timer-low' : 'timer'}>Time left: {formatTime(timeLeft)}</p>}
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: (answers.length / total) * 100 + '%' }} /></div>
      <h3 className="question-text">{current.text}</h3>
      {current.options.map((option, i) => (
        <button key={i} type="button" className={selected === i ? 'option-btn selected' : 'option-btn'} onClick={() => setSelected(i)}>{option}</button>
      ))}
      <div className="form-actions"><button type="button" className="btn btn-primary" onClick={handleNext} disabled={selected === null}>{isLast ? 'Finish quiz' : 'Next question'}</button>
        <button type="button" className="btn" onClick={onQuit}>Quit</button>
      </div>
    </div>
  );
}
