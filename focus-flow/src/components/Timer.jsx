// Formats seconds as MM:SS, e.g. 1500 -> "25:00".
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}
const MODE_LABELS = { work: 'Focus', shortBreak: 'Short break', longBreak: 'Long break' };
export default function Timer({ timer, selectedTask, onStart }) {
  const { mode, status, secondsLeft, workCount } = timer;
  return (
    <div className="timer">
      <div className="mode-tabs">
        {Object.keys(MODE_LABELS).map((key) => (
          <button key={key} className={mode === key ? 'mode-tab active' : 'mode-tab'} onClick={() => timer.switchMode(key)} disabled={status === 'running'}>
            {MODE_LABELS[key]}
          </button>
        ))}
      </div>
      <p className="timer-task">
        {mode === 'work'
          ? selectedTask
            ? 'Focusing on: ' + selectedTask.name
            : 'No task selected — pick one below, or just focus.'
          : mode === 'shortBreak'
            ? 'Take a short break. Stretch, drink some water.'
            : 'Take a long break. You earned it.'}
      </p>
      <p className="timer-display">{formatTime(secondsLeft)}</p>
      <div className="timer-buttons">
        {status === 'running'
          ? <button className="btn btn-primary" onClick={timer.pause}>Pause</button>
          : <button className="btn btn-primary" onClick={onStart}>{status === 'paused' ? 'Resume' : 'Start'}</button>}
        <button className="btn" onClick={timer.reset}>Reset</button>
      </div>
      <p className="timer-cycle">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i < workCount ? 'dot filled' : 'dot'} />
        ))}
        {workCount} of 4 focus sessions until a long break
      </p>
    </div>
  );
}
