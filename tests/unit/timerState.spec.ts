import { jest } from '@jest/globals';
import { TimerConfig } from '../../src/timerConfig';
import { TimerState, TimerCallbacks } from '../../src/timerState';

describe('TimerState', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('onWorkStart が start() 呼び出し時に cycle=1 で呼ばれる', () => {
        const config = new TimerConfig({ cycles: 1, workDuration: 0.05, breakDuration: 0.02 });
        const callbacks: TimerCallbacks = {
            onWorkStart: jest.fn(),
        };
        const timer = new TimerState(config, callbacks);

        timer.start();
        expect(callbacks.onWorkStart).toHaveBeenCalledWith(1);
    });

    it('workDuration 経過後に onBreakStart が呼ばれる', () => {
        const config = new TimerConfig({ cycles: 1, workDuration: 0.05, breakDuration: 0.02 });
        const callbacks: TimerCallbacks = {
            onBreakStart: jest.fn(),
        };
        const timer = new TimerState(config, callbacks);

        timer.start();
        jest.advanceTimersByTime(3000);
        expect(callbacks.onBreakStart).toHaveBeenCalledWith(1);
    });

    it('breakDuration 経過後に onCycleEnd が呼ばれる', () => {
        const config = new TimerConfig({ cycles: 1, workDuration: 0.05, breakDuration: 0.02 });
        const callbacks: TimerCallbacks = {
            onCycleEnd: jest.fn(),
        };
        const timer = new TimerState(config, callbacks);

        timer.start();
        jest.advanceTimersByTime(5000);
        expect(callbacks.onCycleEnd).toHaveBeenCalledWith(1);
    });

    it('onTick が毎秒呼ばれる', () => {
        const config = new TimerConfig({ cycles: 1, workDuration: 0.03, breakDuration: 0 });
        const callbacks: TimerCallbacks = {
            onTick: jest.fn(),
            onWorkStart: jest.fn(),
        };
        const timer = new TimerState(config, callbacks);

        timer.start();
        expect(callbacks.onWorkStart).toHaveBeenCalledWith(1);

        jest.advanceTimersByTime(1000);
        expect(callbacks.onTick).toHaveBeenCalledWith((0.03 * 60) - 1, 1);
    });
});
