import { useState, useEffect } from 'react';
import QuizList from './components/QuizList.jsx';
import QuizForm from './components/QuizForm.jsx';
import QuestionForm from './components/QuestionForm.jsx';
import QuizPlayer from './components/QuizPlayer.jsx';
import ResultsReview from './components/ResultsReview.jsx';

// ---------------------------------------------------------------------------
// Seed data, so the app feels alive the first time you open it.
// ---------------------------------------------------------------------------
const seedQuizzes = [
  {
    id: 'html-basics',
    title: 'HTML Basics',
    category: 'Web Development',
    // Countdown in seconds. 0 means no timer.
    timeLimit: 300,
    questions: [
      {
        id: 'html-q1',
        text: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language',
        ],
        correctIndex: 0,
      },
      {
        id: 'html-q2',
        text: 'Which tag makes the largest heading on a page?',
        options: ['<h1>', '<h6>', '<head>', '<header>'],
        correctIndex: 0,
      },
      {
        id: 'html-q3',
        text: 'Which tag creates a link to another page?',
        options: ['<a>', '<link>', '<href>', '<url>'],
        correctIndex: 0,
      },
      {
        id: 'html-q4',
        text: 'Which attribute gives an image its text alternative?',
        options: ['alt', 'src', 'title', 'text'],
        correctIndex: 0,
      },
      {
        id: 'html-q5',
        text: 'Which tag holds the page metadata, like the title and character set?',
        options: ['<head>', '<body>', '<footer>', '<main>'],
        correctIndex: 0,
      },
    ],
  },
];

// One past attempt, so the statistics on the seed quiz already show something.
const seedAttempts = [
  {
    id: 'attempt-1',
    quizId: 'html-basics',
    score: 4,
    total: 5,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Small helper for unique ids (quizzes, questions, attempts).
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Read one key from localStorage, or fall back when nothing is saved yet.
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Lazy initializers: localStorage is read only once, on the first render.
  const [quizzes, setQuizzes] = useState(() =>
    loadFromStorage('quizforge-quizzes', seedQuizzes),
  );
  const [attempts, setAttempts] = useState(() =>
    loadFromStorage('quizforge-attempts', seedAttempts),
  );

  // Which screen is showing: 'list' | 'create' | 'edit' | 'play' | 'results'
  const [view, setView] = useState('list');
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // The question form inside the edit screen.
  // editingQuestion is null when adding a new question, or the question being edited.
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Save to localStorage whenever quizzes or attempts change.
  useEffect(() => {
    localStorage.setItem('quizforge-quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quizforge-attempts', JSON.stringify(attempts));
  }, [attempts]);

  const activeQuiz = quizzes.find((quiz) => quiz.id === activeQuizId) || null;

  function backToList() {
    setView('list');
    setActiveQuizId(null);
    setLastResult(null);
    setQuestionFormOpen(false);
    setEditingQuestion(null);
  }

  // --- Quizzes -------------------------------------------------------------
  function handleCreateQuiz(data) {
    const quiz = { id: makeId(), questions: [], ...data };
    setQuizzes([...quizzes, quiz]);
    setActiveQuizId(quiz.id);
    setView('edit');
  }

  function handleUpdateQuiz(quizId, data) {
    setQuizzes(
      quizzes.map((quiz) => (quiz.id === quizId ? { ...quiz, ...data } : quiz)),
    );
  }

  function handleDeleteQuiz(quizId) {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    // A deleted quiz takes its attempt history with it.
    setAttempts(attempts.filter((attempt) => attempt.quizId !== quizId));
  }

  // --- Questions (inside the quiz being edited) -----------------------------
  function handleSaveQuestion(data) {
    if (editingQuestion) {
      setQuizzes(
        quizzes.map((quiz) =>
          quiz.id === activeQuizId
            ? {
                ...quiz,
                questions: quiz.questions.map((q) =>
                  q.id === editingQuestion.id ? { ...q, ...data } : q,
                ),
              }
            : quiz,
        ),
      );
    } else {
      const question = { id: makeId(), ...data };
      setQuizzes(
        quizzes.map((quiz) =>
          quiz.id === activeQuizId
            ? { ...quiz, questions: [...quiz.questions, question] }
            : quiz,
        ),
      );
    }
    setQuestionFormOpen(false);
    setEditingQuestion(null);
  }

  function handleDeleteQuestion(quizId, questionId) {
    setQuizzes(
      quizzes.map((quiz) =>
        quiz.id === quizId
          ? {
              ...quiz,
              questions: quiz.questions.filter((q) => q.id !== questionId),
            }
          : quiz,
      ),
    );
  }

  // --- Playing ---------------------------------------------------------------
  function handleFinishQuiz(result) {
    const attempt = {
      id: makeId(),
      quizId: result.quizId,
      score: result.score,
      total: result.total,
      date: new Date().toISOString(),
    };
    setAttempts([...attempts, attempt]);
    setLastResult(result);
    setView('results');
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>QuizForge</h1>
        <p className="muted">
          Make your own quizzes, play them, and watch your scores grow.
        </p>
      </header>

      {view === 'list' && (
        <QuizList
          quizzes={quizzes}
          attempts={attempts}
          onCreate={() => setView('create')}
          onPlay={(quizId) => {
            setActiveQuizId(quizId);
            setView('play');
          }}
          onEdit={(quizId) => {
            setActiveQuizId(quizId);
            setView('edit');
          }}
          onDelete={handleDeleteQuiz}
        />
      )}

      {view === 'create' && (
        <div className="card">
          <h2>Create a new quiz</h2>
          <QuizForm
            onSave={handleCreateQuiz}
            onCancel={backToList}
            submitLabel="Create quiz"
          />
        </div>
      )}

      {view === 'edit' && activeQuiz && (
        <div>
          <div className="card">
            <h2>Edit quiz</h2>
            <QuizForm
              initialQuiz={activeQuiz}
              onSave={(data) => handleUpdateQuiz(activeQuiz.id, data)}
              onCancel={backToList}
              submitLabel="Save changes"
            />
          </div>

          <section className="card">
            <h2>Questions ({activeQuiz.questions.length})</h2>
            {activeQuiz.questions.length === 0 ? (
              <p className="muted">
                No questions yet. Add your first one below — a quiz needs at
                least one question before it can be played.
              </p>
            ) : (
              <ul className="question-list">
                {activeQuiz.questions.map((question, index) => (
                  <li key={question.id} className="question-item">
                    <div>
                      <strong>
                        {index + 1}. {question.text}
                      </strong>
                      <p className="muted small">
                        Correct answer: {question.options[question.correctIndex]}
                      </p>
                    </div>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => {
                          setEditingQuestion(question);
                          setQuestionFormOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() =>
                          handleDeleteQuestion(activeQuiz.id, question.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {questionFormOpen ? (
              <QuestionForm
                initialQuestion={editingQuestion}
                onSave={handleSaveQuestion}
                onCancel={() => {
                  setQuestionFormOpen(false);
                  setEditingQuestion(null);
                }}
              />
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionFormOpen(true);
                }}
              >
                + Add a question
              </button>
            )}
          </section>

          <button type="button" className="btn btn-primary" onClick={backToList}>
            Done — back to quizzes
          </button>
        </div>
      )}

      {view === 'play' && activeQuiz && (
        <QuizPlayer
          quiz={activeQuiz}
          onFinish={handleFinishQuiz}
          onQuit={backToList}
        />
      )}

      {view === 'results' && lastResult && (
        <ResultsReview
          result={lastResult}
          onPlayAgain={() => setView('play')}
          onBackToList={backToList}
        />
      )}

      <footer className="app-footer">
        <p className="muted small">
          Your quizzes and attempts are saved in this browser (localStorage).
        </p>
      </footer>
    </div>
  );
}
