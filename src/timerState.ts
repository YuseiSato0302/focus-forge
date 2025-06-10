import { TimerConfig } from './timerConfig';

export type TimerCallbacks = {
  // 毎秒呼ばれる、remainingSeconds.toFixed(2)でUI表示 
  onTick?: (remainingSeconds: number, currentCycle: number) => void;
  onWorkStart?: (cycle: number) => void;
  onBreakStart?: (cycle: number) => void;
  onCycleEnd?: (cycle: number) => void;
};

export class TimerState {
  private config: TimerConfig;
  private callbacks: TimerCallbacks;
  private currentCycle!: number;
  private phase!: 'idle' | 'work' | 'break' | 'paused';
  private remainingSeconds!: number;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config: TimerConfig, callbacks: TimerCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
    this.reset();
  }

  start(): void {
    if (this.intervalId) return;
    this.reset();
    this.startWorkPhase(1);
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.phase = 'paused';
    }
  }

  resume(): void {
    if (this.intervalId || this.phase === 'idle') return;
    if (this.phase === 'work') {
      this.runWorkTicker();
    } else if (this.phase === 'break') {
      this.runBreakTicker();
    }
  }

  reset(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.currentCycle = 1;
    this.phase = 'idle';
    this.remainingSeconds = 0;
    this.intervalId = null;
  }

  getCurrentCycle(): number {
    return this.currentCycle;
  }

  getRemainingSeconds(): number {
    return this.remainingSeconds;
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  private startWorkPhase(cycle: number): void {
    this.phase = 'work';
    this.currentCycle = cycle;
    this.remainingSeconds = this.config.workDuration * 60;
    this.callbacks.onWorkStart?.(cycle);
    this.runWorkTicker();
  }

  private runWorkTicker(): void {
    this.intervalId = setInterval(() => {
      this.remainingSeconds -= 1;
      this.callbacks.onTick?.(this.remainingSeconds, this.currentCycle);
      if (this.remainingSeconds <= 0) {
        clearInterval(this.intervalId!);
        this.intervalId = null;
        this.startBreakPhase(this.currentCycle);
      }
    }, 1000);
  }

  private startBreakPhase(cycle: number): void {
    this.phase = 'break';
    this.remainingSeconds = this.config.breakDuration * 60;
    this.callbacks.onBreakStart?.(cycle);
    this.runBreakTicker();
  }

  private runBreakTicker(): void {
    this.intervalId = setInterval(() => {
      this.remainingSeconds -= 1;
      this.callbacks.onTick?.(this.remainingSeconds, this.currentCycle);
      if (this.remainingSeconds <= 0) {
        clearInterval(this.intervalId!);
        this.intervalId = null;
        this.callbacks.onCycleEnd?.(this.currentCycle);
        if (this.currentCycle < this.config.cycles) {
          this.startWorkPhase(this.currentCycle + 1);
        }
      }
    }, 1000);
  }
}