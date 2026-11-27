// Best score, average score and total attempts for one quiz.
export default function StatsPanel({ attempts, total }) {
  if (attempts.length === 0) return <p className="muted small">No attempts yet — play this quiz to see your stats.</p>;
  const scores = attempts.map((a) => a.score);
  const best = Math.max(...scores);
  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return (
    <div className="stat-grid">
      <div className="stat"><span className="stat-value">{best}/{total}</span><span className="stat-label">Best score</span></div>
      <div className="stat"><span className="stat-value">{average.toFixed(1)}/{total}</span><span className="stat-label">Average</span></div>
      <div className="stat"><span className="stat-value">{attempts.length}</span><span className="stat-label">Attempts</span></div>
    </div>
  );
}
