import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

/**
 * 作業セッションのデータ構造
 */
export interface WorkSession {
    id: string;
    title: string;
    started_at: Date;
    ended_at: Date;
    duration_minutes: number;
    tags: string[];
    created_at?: Date;
}

// DBから返される生データ型
type Row = {
    id: string;
    title: string;
    started_at: string;
    ended_at: string;
    duration_minutes: number;
    tags: string;
    created_at: string;
};

/**
 * SQLite データベースを開き、スキーマを適用して返す
 * @param filename ':memory:' でインメモリDB
 */
export async function getDb(filename: string): Promise<Database> {
    const db = await open({
        filename,
        driver: sqlite3.Database,
    });
    await db.exec(
        `CREATE TABLE IF NOT EXISTS work_sessions (
            id TEXT PRIMARY KEY,
            title TEXT,
            started_at DATETIME,
            ended_at DATETIME,
            duration_minutes INTEGER,
            tags TEXT,
            created_at DATETIME DEFAULT (datetime('now'))
        );`
    );
    return db;
}

/**
 * セッションを work_sessions テーブルに保存する
 */
export async function saveSession(db: Database, session: WorkSession): Promise<void> {
  // session.tags が配列かどうかもチェック
  const tagsToSave = Array.isArray(session.tags) && session.tags.length > 0
    ? session.tags
    : ['未選択'];

  await db.run(
    `INSERT INTO work_sessions (id, title, started_at, ended_at, duration_minutes, tags)
     VALUES (?, ?, ?, ?, ?, ?)`,
    session.id,
    session.title,
    session.started_at.toISOString(),
    session.ended_at.toISOString(),
    session.duration_minutes,
    JSON.stringify(tagsToSave)
  );
}

/**
 * work_sessions テーブルからセッションを取得する
 * 最新順 (rowid 降順)
 */
export async function listSessions(db: Database): Promise<WorkSession[]> {
    const rowsRaw = await db.all(
        `SELECT id, title, started_at, ended_at, duration_minutes, tags, created_at
         FROM work_sessions
         ORDER BY rowid DESC`
    );
    const rows = rowsRaw as Row[];
    return rows.map(r => {
        const parsedTags: string[] = JSON.parse(r.tags);
        const tagsArray = parsedTags.length > 0 ? parsedTags : ['未選択'];
        return {
            id: r.id,
            title: r.title,
            started_at: new Date(r.started_at),
            ended_at: new Date(r.ended_at),
            duration_minutes: r.duration_minutes,
            tags: tagsArray,
            created_at: new Date(r.created_at),
        };
    });
}
