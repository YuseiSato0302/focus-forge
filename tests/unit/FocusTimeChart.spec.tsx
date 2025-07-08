import { groupSessionsByPeriod } from '../../src/utils/group';
import { WorkSession } from '../../src/db';

describe('groupSessionsByPeriod のユニットテスト', () => {
  const base = new Date('2025-06-10T00:00:00Z');
  const next = new Date(base.getTime() + 86400000);
  const sessions: WorkSession[] = [
    { id: '1', title: 'A', started_at: base, ended_at: base, duration_minutes: 10, tags: ['t1'], created_at: base },
    { id: '2', title: 'B', started_at: next, ended_at: next, duration_minutes: 20, tags: ['t2'], created_at: next },
  ];

  it('daily でグルーピングされること', () => {
    const result = groupSessionsByPeriod(sessions, 'daily');
    expect(result).toEqual([
      { name: base.toLocaleDateString(), value: 10 },
      { name: next.toLocaleDateString(), value: 20 },
    ]);
  });

  it('weekly でグルーピングされること', () => {
    const weekly = groupSessionsByPeriod(sessions, 'weekly');
    const weekKey = `${base.getFullYear()}-${base.getMonth()+1}-W2`;
    expect(weekly).toEqual([{ name: weekKey, value: 30 }]);
  });

  it('monthly でグルーピングされること', () => {
    const monthly = groupSessionsByPeriod(sessions, 'monthly');
    const monthKey = `${base.getFullYear()}-${base.getMonth()+1}`;
    expect(monthly).toEqual([{ name: monthKey, value: 30 }]);
  });
});
