"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

type Mode = "focus" | "break";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function Pomodoro() {
  const [mode, setMode] = useState<Mode>("focus");
  const [seconds, setSeconds] = useState(FOCUS_TIME);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setRunning(false);
    setSeconds(nextMode === "focus" ? FOCUS_TIME : BREAK_TIME);
  }

  function resetTimer() {
    setRunning(false);
    setSeconds(mode === "focus" ? FOCUS_TIME : BREAK_TIME);
  }

  const total = mode === "focus" ? FOCUS_TIME : BREAK_TIME;
  const progress = ((total - seconds) / total) * 100;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <section className="widget pomodoro-widget">
      <div className="widget-heading">
        <div className="widget-title">
          <Timer size={19} />
          <h2>Focus Timer</h2>
        </div>
        <span>{mode === "focus" ? "Stay focused" : "Take a break"}</span>
      </div>

      <div className="pomodoro-modes">
        <button className={mode === "focus" ? "active" : ""} onClick={() => changeMode("focus")}>
          Focus
        </button>
        <button className={mode === "break" ? "active" : ""} onClick={() => changeMode("break")}>
          Break
        </button>
      </div>

      <div className="timer-display" aria-live="polite">
        {String(minutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
      </div>

      <div className="timer-progress">
        <div style={{ width: `${progress}%` }} />
      </div>

      <div className="timer-controls">
        <button
          className="timer-start"
          onClick={() => setRunning((previous) => !previous)}
          disabled={seconds === 0}
        >
          {running ? <Pause size={17} /> : <Play size={17} />}
          {running ? "Pause" : "Start"}
        </button>
        <button className="timer-reset" onClick={resetTimer} aria-label="Reset timer">
          <RotateCcw size={17} />
        </button>
      </div>

      {seconds === 0 && <p className="timer-finished">Time is up! Great work.</p>}
    </section>
  );
}
