import { contextBridge, ipcRenderer } from 'electron';
import { Database } from 'sqlite';
import { getDb, saveSession, listSessions, WorkSession } from './db';

// アプリケーションで使用する DB ファイル名
const DB_PATH = 'focusforge.db';

let db: Database | null = null;

async function initDb() {
  if (!db) {
    db = await getDb(DB_PATH);
  }
  return db;
}

contextBridge.exposeInMainWorld('api', {
  /**
   * 作業セッションを保存する
   * @param session WorkSession 型オブジェクト
   */
  saveSession: async (session: WorkSession): Promise<void> => {
    const database = await initDb();
    await saveSession(database, session);
  },

  /**
   * 保存済みの作業セッション一覧を取得する
   */
  listSessions: async (): Promise<WorkSession[]> => {
    const database = await initDb();
    return listSessions(database);
  }
});

// レンダラープロセス向けの API を公開
contextBridge.exposeInMainWorld('api', {
  saveSession: (session: any) => ipcRenderer.invoke('save-session', session),
  listSessions: () => ipcRenderer.invoke('list-sessions'),
  saveCSV: (csvData: string) => ipcRenderer.invoke('save-csv', csvData),
});

