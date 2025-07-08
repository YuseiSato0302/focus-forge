import type { WorkSession } from './db';

declare global {
  interface Window {
    api: {
      saveSession: (session: WorkSession) => Promise<void>;
      listSessions: () => Promise<WorkSession[]>;
      saveCSV: (csvData: string) => Promise<void>;
    };
  }
}

export {};
