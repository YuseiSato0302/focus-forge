import { groupTagsBySessions } from '../../src/utils/group';
import { WorkSession } from '../../src/db';

describe('groupTagsBySessions のユニットテスト', () => {
  it('タグごとに均等に分割して集計されること', () => {
    const base = new Date();
    const sessions: WorkSession[] = [
      { id: '1', title: 'A', started_at: base, ended_at: base, duration_minutes: 30, tags: ['x','y'], created_at: base },
      { id: '2', title: 'B', started_at: base, ended_at: base, duration_minutes: 30, tags: ['x'], created_at: base },
    ];
    const result = groupTagsBySessions(sessions);
    expect(result).toEqual(
      expect.arrayContaining([
        { name: 'x', value: 45 },
        { name: 'y', value: 15 },
      ])
    );
  });
});
