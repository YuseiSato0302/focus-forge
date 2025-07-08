import { WorkSession } from '../db';

export type ChartPoint = { name: string; value: number };

/**
 * セッションを日/週/月単位でグルーピングする
 */
export function groupSessionsByPeriod(
  sessions: WorkSession[],
  period: 'daily' | 'weekly' | 'monthly'
): ChartPoint[] {
  const map: Record<string, number> = {};
  sessions.forEach(({ created_at, duration_minutes }) => {
    const d = created_at ?? new Date();
    let key: string;
    if (period === 'daily') {
      key = d.toLocaleDateString();
    } else if (period === 'weekly') {
      const week = Math.ceil(d.getDate() / 7);
      key = `${d.getFullYear()}-${d.getMonth() + 1}-W${week}`;
    } else {
      key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    }
    map[key] = (map[key] || 0) + duration_minutes;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * タグごとにセッション時間を均等に分割して集計する
 */
export function groupTagsBySessions(
  sessions: WorkSession[]
): ChartPoint[] {
  const map: Record<string, number> = {};
  sessions.forEach(({ duration_minutes, tags }) => {
    const per = duration_minutes / (tags.length || 1);
    tags.forEach(tag => {
      map[tag] = (map[tag] || 0) + per;
    });
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}
