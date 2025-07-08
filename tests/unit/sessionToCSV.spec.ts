import { sessionsToCSV } from '../../src/utils/sessionToCSV';
import { WorkSession } from '../../src/db';

describe('sessionsToCSV ユーティリティ', () => {
    const base = new Date('2025-07-08T12:34:56Z');
    const session: WorkSession = {
        id: 'uuid123',
        title: 'Test Session',
        started_at: new Date('2025-07-08T10:00:00Z'),
        ended_at: new Date('2025-07-08T10:25:00Z'),
        duration_minutes: 25,
        tags: ['tag1', 'tag2'],
        created_at: base,
    };

    it('空配列の場合はヘッダーのみを返す', () => {
        const csv = sessionsToCSV([]);
        const lines = csv.split('\n');
        expect(lines).toHaveLength(1);
        expect(lines[0]).toBe('id,title,started_at,ended_at,duration_minutes,tags,created_at');
    });

    it('単一セッションを正しく CSV に変換する', () => {
        const csv = sessionsToCSV([session]);
        const lines = csv.split('\n');
        expect(lines).toHaveLength(2);
        expect(lines[0]).toBe('id,title,started_at,ended_at,duration_minutes,tags,created_at');
        const fields = lines[1].split(',');
        expect(fields[0]).toBe('uuid123');
        expect(fields[1]).toBe('Test Session');
        expect(fields[2]).toBe('2025-07-08T10:00:00.000Z');
        expect(fields[3]).toBe('2025-07-08T10:25:00.000Z');
        expect(fields[4]).toBe('25');
        // セミコロン区切りタグ確認
        expect(fields[5]).toBe('tag1;tag2');
        expect(fields[6]).toBe('2025-07-08T12:34:56.000Z');
    });

    it('created_at が undefined の場合は空欄になる', () => {
        const sess = { ...session, created_at: undefined } as WorkSession;
        const csv = sessionsToCSV([sess]);
        const fields = csv.split('\n')[1].split(',');
        expect(fields[6]).toBe('');
    });
});
