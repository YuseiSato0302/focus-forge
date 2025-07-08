import { WorkSession } from '../db';

/**
 * WorkSession 配列を CSV 文字列に変換する
 */
export function sessionsToCSV(sessions: WorkSession[]): string {
    const header = ['id', 'title', 'started_at', 'ended_at', 'duration_minutes', 'tags', 'created_at'];
    const escape = (value: string) =>
        /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

    const rows = sessions.map(s => [
        s.id,
        escape(s.title),
        s.started_at.toISOString(),
        s.ended_at.toISOString(),
        s.duration_minutes.toString(),
        escape(s.tags.join(';')),
        s.created_at ? s.created_at.toISOString() : ''
    ].join(','));

    return [header.join(','), ...rows].join('\n');
}