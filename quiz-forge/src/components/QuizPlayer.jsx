import { useState, useEffect, useReducer, useRef } from 'react';

// ---------------------------------------------------------------------------
// Shuffle (Fisher-Yates): walk backwards through a COPY of the array,
// swapping each item with a random earlier one. The original array is
// never changed, so the saved quiz order stays as the user made it.
// ---------------------------------------------------------------------------
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Shuffle the question order AND the options inside every question.
// The correct answer is found again by matching its text in the new order.
function buildPlayQuestions(questions) {
  return shuffle(questions).map((question) => {
    const options = shuffle(question.options);
    return {
      ...question,
      options,
      correctIndex: options.indexOf(question.options[question.correctIndex]),
    };
  });
}

// ---------------------------------------------------------------------------
// The player state lives in one reducer because its pieces change together:
// picking an answer, moving on, the timer ticking, and finishing.
// ---------------------------------------------------------------------------
function playerReducer(state, action) {
  switch (action.type) {
    case 'select':
      // Picking an answer only changes the selection, nothing else.
      return { ...state, selected: action.optionIndex };
    case 'next':
      // Save the current answer, move to the next question, clear the selection.
      return {
        ...state,
        answers: [
          ...state.answers,
          { questionId: action.questionId, chosenIndex: state.selected },
        ],
        index: state.index + 1,
        selected: null,
      };
    case 'tick':
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
    case 'finish':
      return { ...state, finished: true };
    default:
      return state;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

export default function QuizPlayer({ quiz, onFinish, onQuit }) {
  // Build the play set once, when the quiz starts.
  const [playQuestions] = useState(() => buildPlayQuestions(quiz.questions));
  const [state, dispatch] = useReducer(playerReducer, {
    index: 0,
    selected: null,
    answers: [],
    timeLeft: quiz.timeLimit,
    finished: false,
  });

  // The interval id lives in a ref so it can be cleared exactly once,
  // when the quiz ends or the player unmounts.
  const timerRef = useRef(null);

  const total = playQuestions.length;
  const current = playQuestions[state.index];
  const isLast = state.index === total - 1;

  // Start the countdown (only when the quiz has a timer).
  useEffect(() => {
    if (quiz.timeLimit === 0 || state.finished) return undefined;
    timerRef.current = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(timerRef.current);
  }, [quiz.timeLimit, state.finished]);

  // Time ran out: submit whatever has been answered so far.
  useEffect(() => {
    if (quiz.timeLimit > 0 && state.timeLeft === 0 && !state.finished) {
      finishQuiz(state.answers, state.selected);
    }
    // Runs only when the clock changes; finishQuiz reads the latest state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeLeft]);

  function finishQuiz(answers, selected) {
    // Include the current question's answer when one was picked.
    const allAnswers =
      selected === null
        ? answers
        : [...answers, { questionId: current.id, chosenIndex: selected }];

    const score = allAnswers.filter((answer) => {
      const question = playQuestions.find((q) => q.id === answer.questionId);
      return question && answer.chosenIndex === question.correctIndex;
    }).length;

    dispatch({ type: 'finish' });
    onFinish({
      quizId: quiz.id,
      quizTitle: quiz.title,
      category: quiz.category,
      score,
      total,
      playQuestions,
      answers: allAnswers,
    });
  }

  function handleNext() {
    if (state.selected === null) return;
    if (isLast) {
      finishQuiz(state.answers, state.selected);
    } else {
      dispatch({ type: 'next', questionId: current.id });
    }
  }

  return (
    <div className="card">
      <div className="player-top">
        <div>
          <h2>{quiz.title}</h2>
          <p className="muted">
            Question {state.index + 1} of {total}
          </p>
        </div>
        {quiz.timeLimit > 0 && (
          <p className={`timer ${state.timeLeft <= 30 ? 'timer-low' : ''}`}>
            Time left: {formatTime(state.timeLeft)}
          </p>
        )}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(state.answers.length / total) * 100}%` }}
        />
      </div>

      <h3 className="question-text">{current.text}</h3>

      <div>
        {current.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            type="button"
            className={`option-btn ${
              state.selected === optionIndex ? 'selected' : ''
            }`}
            onClick={() => dispatch({ type: 'select', optionIndex })}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={state.selected === null}
        >
          {isLast ? 'Finish quiz' : 'Next question'}
        </button>
        <button type="button" className="btn" onClick={onQuit}>
          Quit
        </button>
      </div>
    </div>
  );
}
