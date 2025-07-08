import { groupSessionsByPeriod, ChartPoint } from '../../src/utils/group';
import { WorkSession } from '../../src/db';

const base = new Date('2025-06-10T00:00:00Z');
const sessions: WorkSession[] = [
  { id: '1', title: 'A', started_at: base, ended_at: base, duration_minutes: 10, tags: ['t1'], created_at: base },
  { id: '2', title: 'B', started_at: new Date(base.getTime() + 86400000), ended_at: new Date(base.getTime() + 86400000), duration_minutes: 20, tags: ['t2'], created_at: new Date(base.getTime() + 86400000) },
];

describe('groupSessionsByPeriod', () => {
  it('daily で日付キーでグループ化される', () => {
    const pts = groupSessionsByPeriod(sessions, 'daily');
    expect(pts).toEqual([
      { name: base.toLocaleDateString(),       value: 10 },
      { name: new Date(base.getTime() + 86400000).toLocaleDateString(), value: 20 },
    ]);
  });

  it('weekly で週キーでグループ化される', () => {
    const pts = groupSessionsByPeriod(sessions.slice(0, 1), 'weekly');
    expect(pts).toEqual([
      { name: `${base.getFullYear()}-${base.getMonth()+1}-W2`, value: 10 },
    ]);
  });

  it('monthly で月キーでグループ化される', () => {
    const pts = groupSessionsByPeriod(sessions.slice(0, 1), 'monthly');
    expect(pts).toEqual([
      { name: `${base.getFullYear()}-${base.getMonth()+1}`, value: 10 },
    ]);
  });
});
