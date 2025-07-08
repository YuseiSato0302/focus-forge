# FocusForge 開発プロセス

このドキュメントでは、FocusForge デスクトップアプリの**これまでの開発過程**と**今後の開発予定**をまとめています。第三者が進捗状況や次に行うべき作業を一目で把握できるように設計しています。

---

## 1. これまでの開発ステップ

### ステップ1：プロジェクトセットアップ & タイマーモジュール構築
1. **技術選定**  
   - Electron + React + TypeScript + Tailwind CSS  
   - SQLite＋`sqlite3`/`sqlite` ラッパー  
2. **タイマーコアロジック (TimerState)**  
   - ポモドーロタイマー（ワーク／休憩、サイクル数設定）  
   - `pause`/`resume`/`reset` の状態管理とコールバック設計  
3. **ユニットテスト**  
   - `TimerConfig`, `TimerState` の E2E/ユニット  
   - Jest + Playwright テスト環境構築  

### ステップ2：UI コンポーネント & TDD
1. **コンポーネント作成**  
   - `TimerDisplay`, `TimerControls`, `TimerSettings`  
2. **TypeScript 設定と型エラー修正**  
   - `tsconfig.json`、`jest.config.js` の調整  
   - `global.d.ts` で `window.api` 型定義  
3. **テスト駆動開発 (TDD)**  
   - JSX/TSX テストの型エラー解消  
   - Playwright E2E：Timer 操作シーケンス検証  

### ステップ3：ローカルデータ永続化 (SQLite DAO 層)
1. **DB スキーマ定義 (DDL)**  
   ```sql
   CREATE TABLE work_sessions (
     id TEXT PRIMARY KEY,
     title TEXT,
     started_at DATETIME,
     ended_at DATETIME,
     duration_minutes INTEGER,
     tags TEXT,
     created_at DATETIME DEFAULT (datetime('now'))
   );
   ```  
2. **Data Access Object (DAO)**  
   - `getDb`, `saveSession`, `listSessions` 実装  
   - JSON 形式でのタグ保存・復元  
3. **ユニットテスト**  
   - メモリDB テスト：保存→取得→ソート順  
   - 空タグフォールバック(`['未選択']`) とタグ保持の検証  

### ステップ4：Electron IPC ブリッジ
1. **`preload.ts`** で `contextBridge.exposeInMainWorld('api', …)` を実装  
2. **レンダラー** から `window.api.saveSession` / `listSessions` を呼び出せるよう設定  

### ステップ5：記録モーダル & ナビゲーション
1. **`SessionModal`** コンポーネント  
   - タイトル入力、タグ付与、保存  
2. **`App.tsx` 統合**  
   - 「Timer」／「履歴」タブ切り替え  
   - モーダル表示タイミング (onCycleEnd, Reset)  
3. **ユニットテスト & E2E テスト**  
   - `App` の切り替えロジック検証  
   - Timer→Save→History フロー  

### ステップ6：履歴一覧表示 (HistoryList)
1. **`HistoryList`** コンポーネント  
   - `window.api.listSessions()` を呼び出し  
   - テーブル表示（日付・タイトル・時間・タグ）  
2. **ユニットテスト**  
   - モックデータでエントリレンダリング検証  
3. **E2E テスト**  
   - Timer→Save→History→一覧確認  

### ステップ7：可視化 & 分析機能
1. **グラフユーティリティ**  
   - `groupSessionsByPeriod`, `groupTagsBySessions` の純粋関数化  
   - ユニットテストでロジック検証  
2. **チャートコンポーネント**  
   - `FocusTimeChart` (棒グラフ: daily/weekly/monthly)  
   - `TagPieChart` (円グラフ: タグ別割合)  
   - E2E テスト: History→グラフタブ→チャート存在確認  

---

## 2. 今後の開発ステップ

### ステップ8：設定・エクスポート機能（進行中）
- CSV エクスポートユーティリティ (`sessionsToCSV`) を実装  
- App に「エクスポート (CSV)」ボタン、`handleExport` を追加  

**残作業**
- `preload.ts` で `saveCSV` を公開  
- メインプロセスでファイルダイアログ & 書き込みの IPC 実装  
- E2E テスト: CSV エクスポートフローのモック/検証  

### ステップ9：リファクタリング & デザインスプリント
- UI デザイン刷新（色・タイポ・レイアウト）  
- コンポーネント再利用性向上  
- Figma 等でハイファイモック作成  
- スタイルガイド／デザイントークン整備  

---

**進捗まとめ**
- **完了**: ステップ1〜7  
- **進行中**: ステップ8 (CSV エクスポート機能)  
- **未着手**: ステップ8 残タスク、ステップ9
