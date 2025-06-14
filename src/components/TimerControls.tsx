import React from 'react';

type TimerControlsProps = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
};

export const TimerControls: React.FC<TimerControlsProps> = ({ isRunning, onStart, onPause, onResume, onReset }) => (
  <div className="flex space-x-4 mt-4">
    {!isRunning && <button onClick={onStart} className="px-4 py-2 bg-blue-500 text-white rounded">Start</button>}
    {isRunning && <button onClick={onPause} className="px-4 py-2 bg-yellow-500 text-white rounded">Pause</button>}
    {!isRunning && <button onClick={onResume} className="px-4 py-2 bg-green-500 text-white rounded">Resume</button>}
    <button onClick={onReset} className="px-4 py-2 bg-red-500 text-white rounded">Reset</button>
  </div>
);