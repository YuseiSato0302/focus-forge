import { test, expect, _electron as electron, ElectronApplication, Page } from '@playwright/test';
import path from 'path';

test.describe('FocusForge E2E - CSV Export Flow', () => {
  let electronApp: ElectronApplication;
  let window: Page;

  test.beforeAll(async () => {
    const electronPath = require('electron') as string;
    const entry = path.join(__dirname, '../../dist/src/main.js');
    electronApp = await electron.launch({ executablePath: electronPath, args: [entry] });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // API stub for sessions and CSV
    await window.evaluate(() => {
      (window as any)._sessions = [];
      (window as any).api = (window as any).api || {};
      (window as any).api.saveSession = async (s: any) => ((window as any)._sessions.push(s));
      (window as any).api.listSessions = async () => (window as any)._sessions;
      // Track CSV data
      (window as any)._exportedCSV = null;
      (window as any).api.saveCSV = async (csv: string) => { (window as any)._exportedCSV = csv; };
    });

    // Create one session for export
    await window.click('button:has-text("Start")');
    await window.click('button:has-text("Pause")');
    await window.click('button:has-text("Reset")');
    const titleInput = window.locator('label:has-text("タイトル")').locator('..').locator('input');
    await titleInput.fill('ExportTest');
    const tagInput = window.locator('label:has-text("タグ")').locator('..').locator('input');
    await tagInput.fill('exportTag');
    await window.click('button:has-text("追加")');
    await window.click('button:has-text("保存")');
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('タイマー画面からCSVエクスポート時にCSV文字列が生成される', async () => {
    // Ensure on timer view
    await window.click('[data-testid="export-csv"]');
    // Give time for IPC stub
    await window.waitForTimeout(500);
    // Retrieve the exported CSV from window
    const csv = await window.evaluate(() => (window as any)._exportedCSV as string);
    expect(csv).toContain('ExportTest');
    expect(csv).toContain('exportTag');
    expect(csv.split('\n')[0]).toContain('id,title,started_at');
  });
});