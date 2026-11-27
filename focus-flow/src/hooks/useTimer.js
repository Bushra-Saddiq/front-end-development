import { useEffect, useRef, useState } from 'react';

// Short beep with the Web Audio API, so no sound file is needed.
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // If sound is blocked, the timer still works.
  }
}
// A simple Pomodoro timer. After a session ends it waits for Start,
// it never starts the next session by itself.
export function useTimer(settings, onSessionEnd) {
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [status, setStatus] = useState('idle'); // idle, running, paused
  const [secondsLeft, setSecondsLeft] = useState(settings.work * 60);
  const [workCount, setWorkCount] = useState(0);
  const callbackRef = useRef(onSessionEnd);
  callbackRef.current = onSessionEnd;
  const secondsFor = (m) => (m === 'shortBreak' ? settings.shortBreak : m === 'longBreak' ? settings.longBreak : settings.work) * 60;
  // Tick once a second while running. The cleanup stops the interval.
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [status]);
  // When the countdown hits zero, switch to the next mode.
  useEffect(() => {
    if (status !== 'running' || secondsLeft > 0) return;
    playBeep();
    if (mode === 'work') {
      const count = workCount + 1;
      const next = count % 4 === 0 ? 'longBreak' : 'shortBreak';
      setWorkCount(count);
      setMode(next);
      setSecondsLeft(secondsFor(next));
      callbackRef.current('work');
    } else {
      if (mode === 'longBreak') setWorkCount(0);
      setMode('work');
      setSecondsLeft(secondsFor('work'));
      callbackRef.current(mode);
    }
    setStatus('idle');
  }, [secondsLeft, status, mode, workCount, settings]);
  // New durations reset the timer to the new length.
  useEffect(() => {
    setSecondsLeft(secondsFor(mode));
    setStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.work, settings.shortBreak, settings.longBreak]);
  return {
    mode, status, secondsLeft, workCount,
    start: () => setStatus('running'),
    pause: () => setStatus('paused'),
    reset: () => { setSecondsLeft(secondsFor(mode)); setStatus('idle'); },
    switchMode: (m) => { setMode(m); setSecondsLeft(secondsFor(m)); setStatus('idle'); },
  };
}
