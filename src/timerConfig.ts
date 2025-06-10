export interface TimerConfigParams {
    cycles?: number;
    workDuration?: number;
    breakDuration?: number;
}

export class TimerConfig {
    readonly cycles: number;
    readonly workDuration: number;
    readonly breakDuration: number;

    constructor({
        cycles = 3,
        workDuration = 25,
        breakDuration = 5,
    }: TimerConfigParams = {}) {
        this.cycles = cycles;
        this.workDuration = workDuration;
        this.breakDuration = breakDuration;
    }
}