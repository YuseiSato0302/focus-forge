import { test, expect, _electron as electron, ElectronApplication, Page } from '@playwright/test';
import * as path from 'path';

let electronApp: ElectronApplication;
let window: Page;

test.describe('FocusForge E2E (Electron)', () => {
  test.beforeAll(async () => {
    // Electron バイナリのパス
    const electronPath = require('electron') as string;
    // ビルド後のメインプロセススクリプトを直接指定
    const entry = path.join(__dirname, '../../dist/src/main.js');

    electronApp = await electron.launch({
      executablePath: electronPath,
      args: [entry],
    });
    window = await electronApp.firstWindow();
    // DOM が読み込まれるのを待機
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    if (electronApp) await electronApp.close();
  });

  test('Start → Pause → Resume → Reset sequence', async () => {
    const display = window.locator('[data-testid="timer-display"] span').first();

    // Start
    await window.click('button:has-text("Start")');
    await window.waitForTimeout(1100);
    const beforeText = await display.textContent();
    expect(beforeText).not.toBeNull();
    const beforeValue = parseFloat(beforeText!);

    await window.waitForTimeout(1000);
    const afterText = await display.textContent();
    expect(afterText).not.toBeNull();
    const afterValue = parseFloat(afterText!);
    expect(afterValue).toBeLessThan(beforeValue);

    // Pause
    await window.click('button:has-text("Pause")');
    const pausedText = await display.textContent();
    expect(pausedText).not.toBeNull();
    await window.waitForTimeout(1000);
    expect(await display.textContent()).toBe(pausedText);

        // Resume
    await window.click('button:has-text("Resume")');
    // 次の tick を確実に待つために1.2秒待機
    await window.waitForTimeout(1200);
    const resumedText = await display.textContent();
    expect(resumedText).not.toBeNull();
    const resumedValue = parseFloat(resumedText!);
    expect(resumedValue).toBeLessThan(parseFloat(pausedText!));

    // Reset
    await window.click('button:has-text("Reset")');
    const resetText = await display.textContent();
    expect(resetText).not.toBeNull();
    expect(/^[0-9]+\.[0-9]{2}$/.test(resetText!)).toBe(true);
  });
});
