import { useMemo } from 'react';

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function StatsPanel({ sessions }) {
  // All stats are derived from the session log, so they stay correct
  // automatically whenever a session is added.
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let todayCount = 0;
    let todayMinutes = 0;
    let weekCount = 0;
    let totalMinutes = 0;

    sessions.forEach((session) => {
      const date = new Date(session.date);
      totalMinutes += session.minutes;
      if (isSameDay(date, now)) {
        todayCount += 1;
        todayMinutes += session.minutes;
      }
      if (date >= weekAgo) {
        weekCount += 1;
      }
    });

    return { todayCount, todayMinutes, weekCount, totalMinutes };
  }, [sessions]);

  return (
    <div>
      <h2>Your focus stats</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-number">{stats.todayCount}</span>
          <span className="stat-label">sessions today</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.todayMinutes}</span>
          <span className="stat-label">focus minutes today</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.weekCount}</span>
          <span className="stat-label">sessions in the last 7 days</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.totalMinutes}</span>
          <span className="stat-label">total focus minutes</span>
        </div>
      </div>

      <h3>Session log</h3>
      {sessions.length === 0 ? (
        <p className="empty-note">
          No finished sessions yet. Complete a focus session and it will show up
          here.
        </p>
      ) : (
        <ul className="session-log">
          {sessions.slice(0, 10).map((session) => {
            const date = new Date(session.date);
            return (
              <li key={session.id}>
                <span>{session.taskName}</span>
                <span>
                  {session.minutes} min ·{' '}
                  {date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  {date.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
