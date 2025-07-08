import { test, expect, _electron as electron, ElectronApplication, Page } from '@playwright/test';
import path from 'path';

test.describe('FocusForge E2E - History Charts Flow', () => {
  let electronApp: ElectronApplication;
  let window: Page;

  test.beforeAll(async () => {
    const electronPath = require('electron') as string;
    const entry = path.join(__dirname, '../../dist/src/main.js');
    electronApp = await electron.launch({ executablePath: electronPath, args: [entry] });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Stub API to use in-memory sessions
    await window.evaluate(() => {
      (window as any)._sessions = [];
      (window as any).api = (window as any).api || {};
      (window as any).api.saveSession = async (session: any) => {
        (window as any)._sessions.push(session);
      };
      (window as any).api.listSessions = async () => {
        return (window as any)._sessions;
      };
    });

    // Create one session for testing
    await window.click('button:has-text("Start")');
    await window.click('button:has-text("Pause")');
    await window.click('button:has-text("Reset")');
    // Locator をチェーンして input を特定
    const titleInput = window
      .locator('label:has-text("タイトル")') // タイトルラベル
      .locator('..')                           // ラベルの親要素
      .locator('input');                       // その中の input
    await titleInput.fill('ChartTest');
    const tagInput = window
      .locator('label:has-text("タグ")')
      .locator('..')
      .locator('input');
    await tagInput.fill('chartTag');
    await window.click('button:has-text("追加")');

    await window.click('button:has-text("保存")');
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('期間別グラフタブに表示されるチャート数を確認', async () => {
    await window.click('button:has-text("履歴")');
    await window.click('button:has-text("期間別グラフ")');
    // 棒グラフは daily, weekly, monthly の3つ
    const chartContainers = await window.locator('div.w-full.h-64').count();
    expect(chartContainers).toBeGreaterThanOrEqual(3);
  });

  test('タグ別グラフタブに円グラフが表示される', async () => {
    await window.click('button:has-text("タグ別グラフ")');
    const tagCharts = await window.locator('[data-testid="tag-chart"]').count();
    expect(tagCharts).toBeGreaterThanOrEqual(1);
  });
});
