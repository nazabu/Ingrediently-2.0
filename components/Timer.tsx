import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  durationSeconds: number;
}

const Timer: React.FC<TimerProps> = ({ durationSeconds }) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play a sound here
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationSeconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-3 bg-cream-dark px-3 py-1.5 rounded-lg border border-sage/20">
      <span className={`font-mono font-medium ${timeLeft === 0 ? 'text-sage font-bold' : 'text-charcoal'}`}>
        {formatTime(timeLeft)}
      </span>
      <div className="flex gap-1">
        <button
          onClick={toggleTimer}
          className="p-1 hover:bg-white rounded-md text-charcoal transition-colors"
          title={isActive ? "Pause" : "Start"}
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-1 hover:bg-white rounded-md text-charcoal transition-colors"
          title="Reset"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default Timer;