import React from 'react';

type TimerDisplayProps = {
  remainingSeconds: number;
  currentCycle: number;
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds, currentCycle }) => {
  const display = remainingSeconds.toFixed(2);
  return (
    <div data-testid="timer-display" className="flex flex-col items-center p-4">
      <span className="text-4xl font-bold">{display}</span>
      <span className="text-sm text-gray-500">Cycle {currentCycle}</span>
    </div>
  );
};