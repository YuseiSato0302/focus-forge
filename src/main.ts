import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import fs from 'fs/promises';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

// アプリ起動時
app.whenReady().then(createWindow);

// --- IPC ハンドラ ---
// セッション保存・取得は既存の実装を想定
ipcMain.handle('save-session', async (_event, session) => {
  // 既存の保存ロジック
});
ipcMain.handle('list-sessions', async () => {
  // 既存の取得ロジック
});

// CSV 保存ハンドラ
ipcMain.handle('save-csv', async (event, csvData: string) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'セッションを CSV で保存',
    defaultPath: 'sessions.csv',
    filters: [{ name: 'CSV ファイル', extensions: ['csv'] }],
  });
  if (canceled || !filePath) return;
  await fs.writeFile(filePath, csvData, 'utf-8');
});
