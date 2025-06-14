import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
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

  it('セッションを保存して取得できる', async () => {
    const now = new Date();
    const session: WorkSession = {
      id: 'test-uuid',
      title: 'Test Session',
      started_at: now,
      ended_at: now,
      duration_minutes: 10,
    };

    await saveSession(db, session);
    const sessions = await listSessions(db);

    expect(sessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'test-uuid',
          title: 'Test Session',
          duration_minutes: 10,
        }),
      ])
    );
  });

  it('複数のセッションを登録して最新順で取得できる', async () => {
    const earlier = new Date(Date.now() - 100000);
    const later = new Date();
    const s1: WorkSession = { id: 'uuid1', title: 'First',  started_at: earlier, ended_at: earlier,  duration_minutes: 5 };
    const s2: WorkSession = { id: 'uuid2', title: 'Second', started_at: later,   ended_at: later,   duration_minutes: 15 };

    await saveSession(db, s1);
    // created_at にミリ秒を含むので衝突は起きにくいが念のため少し待機
    await new Promise(resolve => setTimeout(resolve, 10));
    await saveSession(db, s2);

    const results = await listSessions(db);
    expect(results.length).toBe(2);
    expect(results[0].id).toBe('uuid2');
    expect(results[1].id).toBe('uuid1');
  });
});
