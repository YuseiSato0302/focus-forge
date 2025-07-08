import {
  _electron as electron,
  ElectronApplication,
  expect,
  Page,
  test,
} from "@playwright/test";
import path from "path";

let electronApp: ElectronApplication;
let window: Page;

test.describe("FocusForge E2E - History Flow", () => {
  test.beforeAll(async () => {
    const electronPath = require("electron") as string;
    const entry = path.join(__dirname, "../../dist/src/main.js");
    electronApp = await electron.launch({
      executablePath: electronPath,
      args: [entry],
    });
    window = await electronApp.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    await window.evaluate(() => {
      // テスト用セッションストアを用意
      (window as any)._sessions = [];
      // window.api が未定義なら空オブジェクトとして初期化
      (window as any).api = (window as any).api || {};
      // saveSession をスタブ化
      (window as any).api.saveSession = async (session: any) => {
        (window as any)._sessions.push(session);
      };
      // listSessions もスタブ化
      (window as any).api.listSessions = async () => {
        return (window as any)._sessions;
      };
    });
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test("Timer → Save Session → Navigate to History → Verify Entry", async () => {
    // Start timer and immediately reset to open modal
    await window.click('button:has-text("Start")');
    // Pause then Reset to trigger onCycleEnd modal
    await window.click('button:has-text("Pause")');
    await window.click('button:has-text("Reset")');

    // Wait for modal
    await window.waitForSelector("text=セッションを記録");

    // Enter title
    const titleInput = window.locator('label:has-text("タイトル")').locator(
      "..",
    ).locator("input");
    await titleInput.fill("E2E Session");

    // Add tag
    const tagInput = window.locator('label:has-text("タグ")').locator("..")
      .locator("input");
    await tagInput.fill("e2eTag");
    await window.click('button:has-text("追加")');

    // Save
    await window.click('button:has-text("保存")');

    // Navigate to History tab
    await window.click('button:has-text("履歴")');

    // Verify the saved entry appears in the table
    await window.waitForSelector("text=E2E Session");
    expect(await window.locator("text=E2E Session").count()).toBeGreaterThan(0);
    expect(await window.locator("text=e2eTag").count()).toBeGreaterThan(0);
  });
});
