import { useState, useEffect } from 'react';
import QuizList from './components/QuizList.jsx';
import QuizForm from './components/QuizForm.jsx';
import QuestionForm from './components/QuestionForm.jsx';
import QuizPlayer from './components/QuizPlayer.jsx';
import ResultsReview from './components/ResultsReview.jsx';

// One starter quiz, so the app is ready to play on the first open.
const seedQuizzes = [
  { id: 'html-basics', title: 'HTML Basics', category: 'Web Development', timeLimit: 300, questions: [ // 300 seconds. 0 means no timer.
    { id: 'html-q1', text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], correctIndex: 0 },
    { id: 'html-q2', text: 'Which tag makes the largest heading on a page?', options: ['<h1>', '<h6>', '<head>', '<header>'], correctIndex: 0 },
    { id: 'html-q3', text: 'Which tag creates a link to another page?', options: ['<a>', '<link>', '<href>', '<url>'], correctIndex: 0 },
    { id: 'html-q4', text: 'Which attribute gives an image its text alternative?', options: ['alt', 'src', 'title', 'text'], correctIndex: 0 },
    { id: 'html-q5', text: 'Which tag holds the page metadata, like the title and character set?', options: ['<head>', '<body>', '<footer>', '<main>'], correctIndex: 0 },
  ] },
];

// One past attempt, so the stats already show something.const seedAttempts = [{ id: 'attempt-1', quizId: 'html-basics', score: 4, total: 5, date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }];
// Simple id for new quizzes, questions and attempts.
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
export default function App() {
  // Load saved data, or use the seed data the first time.
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem('quizforge-quizzes') || 'null') || seedQuizzes);
  const [attempts, setAttempts] = useState(() => JSON.parse(localStorage.getItem('quizforge-attempts') || 'null') || seedAttempts);

  // Which screen is showing: list, create, edit, play or results.
  const [view, setView] = useState('list');
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Save whenever quizzes or attempts change.
  useEffect(() => {
    localStorage.setItem('quizforge-quizzes', JSON.stringify(quizzes));
    localStorage.setItem('quizforge-attempts', JSON.stringify(attempts));
  }, [quizzes, attempts]);

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) || null;

  function backToList() {
    setView('list'); setActiveQuizId(null); setLastResult(null); setQuestionFormOpen(false); setEditingQuestion(null);
  }

  // Change one quiz and keep the rest as they are.
  function changeQuiz(id, change) {
    setQuizzes(quizzes.map((q) => (q.id === id ? change(q) : q)));
  }

  function handleCreateQuiz(data) {
    const quiz = { id: makeId(), questions: [], ...data };
    setQuizzes([...quizzes, quiz]);
    setActiveQuizId(quiz.id);
    setView('edit');
  }

  function handleDeleteQuiz(quizId) {
    setQuizzes(quizzes.filter((q) => q.id !== quizId));
    // A deleted quiz takes its attempt history with it.
    setAttempts(attempts.filter((a) => a.quizId !== quizId));
  }

  function handleSaveQuestion(data) {
    if (editingQuestion) {
      changeQuiz(activeQuizId, (q) => ({ ...q, questions: q.questions.map((old) => (old.id === editingQuestion.id ? { ...old, ...data } : old)) }));
    } else {
      changeQuiz(activeQuizId, (q) => ({ ...q, questions: [...q.questions, { id: makeId(), ...data }] }));
    }
    setQuestionFormOpen(false);
    setEditingQuestion(null);
  }

  function handleDeleteQuestion(questionId) {
    changeQuiz(activeQuizId, (q) => ({ ...q, questions: q.questions.filter((old) => old.id !== questionId) }));
  }

  function handleFinishQuiz(result) {
    setAttempts([...attempts, { id: makeId(), quizId: result.quizId, score: result.score, total: result.total, date: new Date().toISOString() }]);
    setLastResult(result);
    setView('results');
  }

  return (
    <div className="app">
      <header className="app-header"><h1>QuizForge</h1>
        <p className="muted">Make your own quizzes, play them, and watch your scores grow.</p></header>
      {view === 'list' && <QuizList quizzes={quizzes} attempts={attempts} onCreate={() => setView('create')} onPlay={(id) => { setActiveQuizId(id); setView('play'); }} onEdit={(id) => { setActiveQuizId(id); setView('edit'); }} onDelete={handleDeleteQuiz} />}
      {view === 'create' && (<div className="card"><h2>Create a new quiz</h2>
        <QuizForm onSave={handleCreateQuiz} onCancel={backToList} submitLabel="Create quiz" />
      </div>)}
      {view === 'edit' && activeQuiz && (
        <div>
          <div className="card"><h2>Edit quiz</h2><QuizForm initialQuiz={activeQuiz} onSave={(data) => changeQuiz(activeQuiz.id, (q) => ({ ...q, ...data }))} onCancel={backToList} submitLabel="Save changes" /></div>
          <section className="card">
            <h2>Questions ({activeQuiz.questions.length})</h2>
            {activeQuiz.questions.length === 0 ? (
              <p className="muted">No questions yet. Add your first one below.</p>
            ) : (
              <ul>
                {activeQuiz.questions.map((question, index) => (
                  <li key={question.id} className="question-item">
                    <div><strong>{index + 1}. {question.text}</strong></div>
                    <div className="row-actions"><button type="button" className="btn btn-small" onClick={() => { setEditingQuestion(question); setQuestionFormOpen(true); }}>Edit</button><button type="button" className="btn btn-small btn-danger" onClick={() => handleDeleteQuestion(question.id)}>Delete</button></div>
                  </li>
                ))}
              </ul>
            )}
            {questionFormOpen ? (
              <QuestionForm initialQuestion={editingQuestion} onSave={handleSaveQuestion} onCancel={() => { setQuestionFormOpen(false); setEditingQuestion(null); }} />
            ) : (
              <button type="button" className="btn" onClick={() => { setEditingQuestion(null); setQuestionFormOpen(true); }}>+ Add a question</button>
            )}
          </section>
          <button type="button" className="btn btn-primary" onClick={backToList}>Done — back to quizzes</button>
        </div>
      )}
      {view === 'play' && activeQuiz && <QuizPlayer quiz={activeQuiz} onFinish={handleFinishQuiz} onQuit={backToList} />}
      {view === 'results' && lastResult && <ResultsReview result={lastResult} onPlayAgain={() => setView('play')} onBackToList={backToList} />}
    </div>
  );
}
