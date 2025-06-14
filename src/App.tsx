import React, { useState } from 'react';
import { TimerConfig } from './timerConfig';
import { TimerState } from './timerState';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { TimerSettings } from './components/TimerSettings';
import { SessionModal } from './components/SessionModal';

export const App: React.FC = () => {
  const [config, setConfig] = useState(new TimerConfig());
  const [remaining, setRemaining] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
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
      onCycleEnd: () => {
        setIsRunning(false);
        openModal();
      },
      onPause: () => setIsRunning(false),
      onResume: () => setIsRunning(true),
    })
  );

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Save via preload API
  const handleSave = async (title: string, tags: string[]) => {
    await window.api.saveSession({
      id: crypto.randomUUID(),
      title,
      started_at: new Date(),
      ended_at: new Date(),
      duration_minutes: Math.ceil(remaining),
      tags
    });
    closeModal();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">FocusForge</h1>
      <TimerDisplay remainingSeconds={remaining} currentCycle={currentCycle} />
      <TimerControls
        isRunning={isRunning}
        onStart={() => timer.start()}
        onPause={() => timer.pause()}
        onResume={() => timer.resume()}
        onReset={() => timer.reset()}
      />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Settings</h2>
        <TimerSettings config={config} onChange={setConfig} />
      </div>
      <SessionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
};
