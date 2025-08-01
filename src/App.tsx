import React, { useState } from 'react';
import { TimerConfig } from './timerConfig';
import { TimerState } from './timerState';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { TimerSettings } from './components/TimerSettings';
import { SessionModal } from './components/SessionModal';
import { HistoryList } from './components/HistoryList';
import { sessionsToCSV } from './utils/sessionToCSV'; 

const App: React.FC = () => {
  const [view, setView] = useState<'timer' | 'history'>('timer');

  // タイマー設定と状態
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

  // モーダル制御
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // セッション保存
  const handleSave = async (title: string, tags: string[]) => {
    await window.api.saveSession({
      id: crypto.randomUUID(),
      title,
      started_at: new Date(),
      ended_at: new Date(),
      duration_minutes: Math.ceil(remaining),
      tags,
    });
    closeModal();
  };

  // CSV エクスポート
  const handleExport = async () => {
    const sessions = await window.api.listSessions();
    const csv = sessionsToCSV(sessions);
    await window.api.saveCSV(csv);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">FocusForge</h1>

      {/* ナビゲーション */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setView('timer')}
          className={`px-4 py-2 rounded-t ${view === 'timer' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
        >
          Timer
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-4 py-2 rounded-t ${view === 'history' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
        >
          履歴
        </button>
      </div>

      {/* コンテンツ切り替え */}
      {view === 'timer' ? (
        <>
          <TimerDisplay remainingSeconds={remaining} currentCycle={currentCycle} />
          <TimerControls
            isRunning={isRunning}
            onStart={() => timer.start()}
            onPause={() => timer.pause()}
            onResume={() => timer.resume()}
            onReset={() => { timer.reset(); openModal(); }}
          />

          <div className="mt-6 flex items-center justify-between">
            <TimerSettings config={config} onChange={setConfig} />
            <button
              data-testid="export-csv"
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleExport}
            >
              エクスポート (CSV)
            </button>
          </div>

          <SessionModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
        </>
      ) : (
        <HistoryList />
      )}
    </div>
  );
};

export default App;
