import React, { useState } from 'react';
import { TimerConfig } from '../timerConfig';

type TimerSettingsProps = {
  config: TimerConfig;
  onChange: (newConfig: TimerConfig) => void;
};

export const TimerSettings: React.FC<TimerSettingsProps> = ({ config, onChange }) => {
  const [cycles, setCycles] = useState(config.cycles);
  const [work, setWork] = useState(config.workDuration);
  const [brk, setBrk] = useState(config.breakDuration);

  const apply = () => {
    onChange(new TimerConfig({ cycles, workDuration: work, breakDuration: brk }));
  };

  return (
    <div data-testid="timer-settings" className="p-4 border rounded">
      <label>
        Cycles
        <input data-testid="input-cycles" type="number" value={cycles} min={1} onChange={e => setCycles(Number(e.target.value))} />
      </label>
      <label>
        Work (min)
        <input data-testid="input-work" type="number" value={work} min={1} onChange={e => setWork(Number(e.target.value))} />
      </label>
      <label>
        Break (min)
        <input data-testid="input-break" type="number" value={brk} min={0} onChange={e => setBrk(Number(e.target.value))} />
      </label>
      <button data-testid="button-apply" onClick={apply}>Apply</button>
    </div>
  );
};