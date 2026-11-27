import { useMemo } from 'react';

// Best score, average score and total attempts for one quiz.
// useMemo keeps the maths from re-running on every render — it only
// recalculates when the attempts for this quiz change.
export default function StatsPanel({ attempts, total }) {
  const stats = useMemo(() => {
    if (attempts.length === 0) return null;
    const scores = attempts.map((attempt) => attempt.score);
    const best = Math.max(...scores);
    const average =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return { best, average, count: attempts.length };
  }, [attempts]);

  if (!stats) {
    return <p className="muted small">No attempts yet — play this quiz to see your stats.</p>;
  }

  return (
    <div className="stat-grid">
      <div className="stat">
        <span className="stat-value">
          {stats.best}/{total}
        </span>
        <span className="stat-label">Best score</span>
      </div>
      <div className="stat">
        <span className="stat-value">
          {stats.average.toFixed(1)}/{total}
        </span>
        <span className="stat-label">Average</span>
      </div>
      <div className="stat">
        <span className="stat-value">{stats.count}</span>
        <span className="stat-label">Attempts</span>
      </div>
    </div>
  );
}
