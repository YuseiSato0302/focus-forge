import React, { useState } from 'react';
import { TimerConfig } from './timerConfig';
import { TimerState } from './timerState';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { TimerSettings } from './components/TimerSettings';

export const App: React.FC = () => {
  const [config, setConfig] = useState(new TimerConfig());
  const [remaining, setRemaining] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);

  // ここで「実行中フラグ」を管理
  const [isRunning, setIsRunning] = useState(false);

  const handleTick = (sec: number, cycle: number) => {
    setRemaining(sec);
    setCurrentCycle(cycle);
  };

  const [timer] = useState(() =>
    new TimerState(config, {
      onTick: handleTick,
      onWorkStart: () => setIsRunning(true),
      onBreakStart: () => setIsRunning(true),
      onCycleEnd: () => setIsRunning(false),
      onPause: () => setIsRunning(false),   // ← 追加
      onResume: () => setIsRunning(true),   // ← 追加
    })
  );

  return (
    <div>
      <TimerDisplay remainingSeconds={remaining} currentCycle={currentCycle} />
      <TimerControls
        isRunning={isRunning}
        onStart={() => timer.start()}
        onPause={() => timer.pause()}
        onResume={() => timer.resume()}
        onReset={() => {
          timer.reset();
          setIsRunning(false);
        }}
      />
      <TimerSettings config={config} onChange={setConfig} />
    </div>
  );
};
