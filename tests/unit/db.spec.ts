import { Database } from 'sqlite';
import { getDb, saveSession, listSessions, WorkSession } from '../../src/db';

describe('SQLite DAO 層', () => {
  let db: Database;

  beforeEach(async () => {
    // テストごとにインメモリDBを新規作成
    db = await getDb(':memory:');
  });

  afterEach(async () => {
    await db.close();
  });

  it('セッションを保存して取得できる (タグ未選択時はデフォルトタグ付き)', async () => {
    const now = new Date();
    const session: WorkSession = {
      id: 'test-uuid',
      title: 'Test Session',
      started_at: now,
      ended_at: now,
      duration_minutes: 10,
      tags: [],
    };

    await saveSession(db, session);
    const sessions = await listSessions(db);

    expect(sessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'test-uuid',
          title: 'Test Session',
          duration_minutes: 10,
          tags: ['未選択'],
        }),
      ])
    );
  });

  it('複数のセッションを登録して最新順で取得できる', async () => {
    const earlier = new Date(Date.now() - 100000);
    const later = new Date();
    const s1: WorkSession = {
      id: 'uuid1', title: 'First',  started_at: earlier, ended_at: earlier,  duration_minutes: 5, tags: []
    };
    const s2: WorkSession = {
      id: 'uuid2', title: 'Second', started_at: later,   ended_at: later,   duration_minutes: 15, tags: []
    };

    await saveSession(db, s1);
    await new Promise(resolve => setTimeout(resolve, 10));
    await saveSession(db, s2);

    const results = await listSessions(db);
    expect(results.length).toBe(2);
    expect(results[0].id).toBe('uuid2');
    expect(results[0].tags).toEqual(['未選択']);
    expect(results[1].id).toBe('uuid1');
    expect(results[1].tags).toEqual(['未選択']);
  });

  it('タグを指定して保存したセッションはそのタグを保持する', async () => {
    const now = new Date();
    const session: WorkSession = {
      id: 'tagged-uuid',
      title: 'Tagged Session',
      started_at: now,
      ended_at: now,
      duration_minutes: 20,
      tags: ['focus', 'work'],
    };
    await saveSession(db, session);
    const sessions = await listSessions(db);
    expect(sessions[0].tags).toEqual(['focus', 'work']);
  });
});
