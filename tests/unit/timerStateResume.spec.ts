import { jest } from '@jest/globals';
import { TimerConfig } from '../../src/timerConfig';
import { TimerState } from '../../src/timerState';

describe('TimerState pause/resume', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('pause 후 resume で再度ティックが再開される', () => {
    const cfg = new TimerConfig({ cycles: 1, workDuration: 0.05, breakDuration: 0 });
    const onTick = jest.fn();
    const timer = new TimerState(cfg, { onTick });

    timer.start();
    jest.advanceTimersByTime(1000);       // 1 tick: onTick called
    expect(onTick).toHaveBeenCalledTimes(1);

    timer.pause();
    jest.advanceTimersByTime(2000);       // 停止中の時間は無視
    expect(onTick).toHaveBeenCalledTimes(1);

    timer.resume();
    jest.advanceTimersByTime(1000);       // 再開後の最初の tick
    expect(onTick).toHaveBeenCalledTimes(2);
  });
});
