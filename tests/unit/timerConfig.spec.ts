import { TimerConfig } from '../../src/timerConfig'; 

describe('TimerConfig', () => {
    it('デフォルト値が(cycle=3, work=25, rest=5)であること', () => {
        const cfg = new TimerConfig();
        expect(cfg.cycles).toBe(3);
        expect(cfg.workDuration).toBe(25);
        expect(cfg.breakDuration).toBe(5);
    });

    it('コンストラクタ引数で値を上書きできる', () => {
    const cfg = new TimerConfig({ cycles: 5, workDuration: 30, breakDuration: 10 });
        expect(cfg.cycles).toBe(5);
        expect(cfg.workDuration).toBe(30);
        expect(cfg.breakDuration).toBe(10);
    });

    it('部分的にオプションを渡しても他はデフォルトのまま', () => {
        const cfg = new TimerConfig({ workDuration: 50});
        expect(cfg.cycles).toBe(3);
        expect(cfg.workDuration).toBe(50);
        expect(cfg.breakDuration).toBe(5);
    });
});