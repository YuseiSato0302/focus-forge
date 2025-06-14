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
    /** 保存時刻 (DBのcreated_at) */
    created_at?: Date;
}

// DBから返される生データ型
type Row = {
    id: string;
    title: string;
    started_at: string;
    ended_at: string;
    duration_minutes: number;
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
            created_at DATETIME DEFAULT (datetime('now'))
        );`
    );
    return db;
}

/**
 * セッションを work_sessions テーブルに保存する
 */
export async function saveSession(db: Database, session: WorkSession): Promise<void> {
    await db.run(
        `INSERT INTO work_sessions (id, title, started_at, ended_at, duration_minutes)
         VALUES (?, ?, ?, ?, ?)`,
        session.id,
        session.title,
        session.started_at.toISOString(),
        session.ended_at.toISOString(),
        session.duration_minutes
    );
}

/**
 * work_sessions テーブルからセッションを取得する
 * created_at の降順 (最新順)
 */
export async function listSessions(db: Database): Promise<WorkSession[]> {
    // 全ての行を取得（型定義が一致しない場合はキャストでRow[]とみなす）
    const rowsRaw = await db.all(
    `SELECT id, title, started_at, ended_at, duration_minutes, created_at
     FROM work_sessions
     ORDER BY rowid DESC`
  );
    const rows = rowsRaw as Row[];
    return rows.map(r => ({
        id: r.id,
        title: r.title,
        started_at: new Date(r.started_at),
        ended_at: new Date(r.ended_at),
        duration_minutes: r.duration_minutes,
        created_at: new Date(r.created_at),
    }));
}