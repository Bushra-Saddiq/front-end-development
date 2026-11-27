export default function StatsPanel({ sessions }) {
  const today = new Date().toDateString();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let todayCount = 0;
  let todayMinutes = 0;
  let weekCount = 0;
  let totalMinutes = 0;
  sessions.forEach((session) => {
    totalMinutes += session.minutes;
    if (new Date(session.date).toDateString() === today) {
      todayCount += 1;
      todayMinutes += session.minutes;
    }
    if (new Date(session.date).getTime() >= weekAgo) {
      weekCount += 1;
    }
  });
  return (
    <div>
      <h2>Your focus stats</h2>
      <div className="stats-grid">
        <div className="stat-box"><span className="stat-number">{todayCount}</span> sessions today</div>
        <div className="stat-box"><span className="stat-number">{todayMinutes}</span> focus minutes today</div>
        <div className="stat-box"><span className="stat-number">{weekCount}</span> sessions in the last 7 days</div>
        <div className="stat-box"><span className="stat-number">{totalMinutes}</span> total focus minutes</div>
      </div>
      <h3>Session log</h3>
      {sessions.length === 0 ? (
        <p className="empty-note">No finished sessions yet. Complete a focus session and it will show up here.</p>
      ) : (
        <ul className="session-log">
          {sessions.slice(0, 10).map((session) => (
            <li key={session.id}><span>{session.taskName}</span><span>{session.minutes} min · {new Date(session.date).toLocaleString()}</span></li>
          ))}
        </ul>
      )}
    </div>
  );
}
