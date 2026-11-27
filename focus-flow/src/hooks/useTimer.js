import { useCallback, useEffect, useReducer, useRef } from 'react';

// Timer state machine:
// - status is 'idle', 'running' or 'paused'
// - mode is 'work', 'shortBreak' or 'longBreak'
// - workCount is how many work sessions finished in the current cycle (0-4)
function timerReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...state, status: 'running' };
    case 'pause':
      return { ...state, status: 'paused' };
    case 'reset':
      return { ...state, status: 'idle', secondsLeft: action.seconds };
    case 'tick':
      // Never go below zero, even if an extra tick slips through.
      return { ...state, secondsLeft: Math.max(0, state.secondsLeft - 1) };
    case 'switch':
      return {
        ...state,
        mode: action.mode,
        status: 'idle',
        secondsLeft: action.seconds,
        workCount: action.workCount,
      };
    default:
      return state;
  }
}

// Custom hook that runs the Pomodoro timer.
// settings: { work, shortBreak, longBreak } in minutes.
// onSessionEnd: called with the finished mode ('work', 'shortBreak' or 'longBreak').
export function useTimer(settings, onSessionEnd) {
  const [state, dispatch] = useReducer(timerReducer, {
    mode: 'work',
    status: 'idle',
    secondsLeft: settings.work * 60,
    workCount: 0,
  });

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Keep the latest callback in a ref so the timer never calls an old version.
  const callbackRef = useRef(onSessionEnd);
  useEffect(() => {
    callbackRef.current = onSessionEnd;
  });

  // How many seconds a mode lasts, using the current settings.
  const secondsFor = useCallback(
    (mode) => {
      if (mode === 'shortBreak') return settings.shortBreak * 60;
      if (mode === 'longBreak') return settings.longBreak * 60;
      return settings.work * 60;
    },
    [settings]
  );

  // Play a short two-note beep with the Web Audio API (no audio file needed).
  const playBeep = useCallback(() => {
    try {
      if (!audioRef.current) {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;
        audioRef.current = new AudioContextClass();
      }
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Two short beeps, 0.35 seconds apart.
      [0, 0.35].forEach((delay) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = 880;
        const startAt = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.2, startAt + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.3);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + 0.32);
      });
    } catch {
      // Sound is a nice extra. If audio is blocked, the timer still works.
    }
  }, []);

  // Show a browser notification only if permission was already granted.
  // We never ask for permission here.
  const notify = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body });
      } catch {
        // Notifications are optional; ignore failures.
      }
    }
  }, []);

  // Decide what happens when a session runs out.
  const finishSession = useCallback(() => {
    playBeep();
    if (state.mode === 'work') {
      const newWorkCount = state.workCount + 1;
      // Every 4th work session earns a long break, otherwise a short one.
      const nextMode = newWorkCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      dispatch({
        type: 'switch',
        mode: nextMode,
        seconds: secondsFor(nextMode),
        workCount: newWorkCount,
      });
      notify(
        'Focus session done',
        nextMode === 'longBreak'
          ? 'Great work — take a long break.'
          : 'Nice work — take a short break.'
      );
      callbackRef.current?.('work');
    } else {
      const wasLongBreak = state.mode === 'longBreak';
      dispatch({
        type: 'switch',
        mode: 'work',
        seconds: secondsFor('work'),
        // A long break ends the cycle, so the count starts over.
        workCount: wasLongBreak ? 0 : state.workCount,
      });
      notify('Break over', 'Time to focus again.');
      callbackRef.current?.(state.mode);
    }
  }, [state.mode, state.workCount, secondsFor, playBeep, notify]);

  // The ticking effect: start an interval while running, clean it up on stop.
  useEffect(() => {
    if (state.status !== 'running') {
      return undefined;
    }
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [state.status]);

  // When the countdown reaches zero, finish the session.
  useEffect(() => {
    if (state.status === 'running' && state.secondsLeft <= 0) {
      clearInterval(intervalRef.current);
      finishSession();
    }
  }, [state.secondsLeft, state.status, finishSession]);

  // When durations change in settings, reset the timer to the new length.
  useEffect(() => {
    dispatch({ type: 'reset', seconds: secondsFor(state.mode) });
    // Only re-run when the durations change, not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.work, settings.shortBreak, settings.longBreak]);

  const start = useCallback(() => dispatch({ type: 'start' }), []);
  const pause = useCallback(() => dispatch({ type: 'pause' }), []);
  const reset = useCallback(
    () => dispatch({ type: 'reset', seconds: secondsFor(state.mode) }),
    [secondsFor, state.mode]
  );
  const switchMode = useCallback(
    (mode) => {
      dispatch({
        type: 'switch',
        mode,
        seconds: secondsFor(mode),
        workCount: state.workCount,
      });
    },
    [secondsFor, state.workCount]
  );

  return {
    mode: state.mode,
    status: state.status,
    secondsLeft: state.secondsLeft,
    workCount: state.workCount,
    start,
    pause,
    reset,
    switchMode,
  };
}
