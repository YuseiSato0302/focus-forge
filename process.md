FocusForge 開発プロセス

このドキュメントでは、FocusForge デスクトップアプリのこれまでの開発過程と今後の開発予定をまとめています。第三者が進捗状況や次に行うべき作業を一目で把握できるように設計しています。

1. これまでの開発ステップ

ステップ1：プロジェクトセットアップ & タイマーモジュール構築

技術選定

Electron + React + TypeScript + Tailwind CSS

SQLite＋sqlite3/sqlite ラッパー

タイマーコアロジック (TimerState)

ポモドーロタイマー（ワーク／休憩、サイクル数設定）

pause/resume/reset の状態管理とコールバック設計

ユニットテスト

TimerConfig, TimerState の E2E/ユニット

Jest + Playwright テスト環境構築

ステップ2：UI コンポーネント & TDD

コンポーネント作成

TimerDisplay, TimerControls, TimerSettings

TypeScript 設定と型エラー修正

tsconfig.json、jest.config.js の調整

global.d.ts で window.api 型定義

テスト駆動開発 (TDD)

JSX/TSX テストの型エラー解消

Playwright E2E：Timer 操作シーケンス検証

ステップ3：ローカルデータ永続化 (SQLite DAO 層)

DB スキーマ定義 (DDL)

CREATE TABLE work_sessions (
  id TEXT PRIMARY KEY,
  title TEXT,
  started_at DATETIME,
  ended_at DATETIME,
  duration_minutes INTEGER,
  tags TEXT,
  created_at DATETIME DEFAULT (datetime('now'))
);

Data Access Object (DAO)

getDb, saveSession, listSessions 実装

JSON 形式でのタグ保存・復元

ユニットテスト

メモリDB テスト：保存→取得→ソート順

空タグフォールバック(['未選択']) とタグ保持の検証

ステップ4：Electron IPC ブリッジ

`` で contextBridge.exposeInMainWorld('api', …) を実装

レンダラー から window.api.saveSession / listSessions を呼び出せるよう設定

ステップ5：記録モーダル & ナビゲーション

`` コンポーネント

タイトル入力、タグ付与、保存

``** 統合**

SessionModal 呼び出しタイミング (onCycleEnd)

タブベースのビュー切り替え（Timer ↔ History）実装

コンポーネントテスト

SessionModal, App のユニットテスト追加

2. 今後の開発ステップ

ステップ6：履歴一覧表示 (HistoryList)

`` コンポーネント作成

window.api.listSessions() でデータ取得

テーブル形式で日付・タイトル・所要時間・タグを一覧化

単体テスト

モックデータでレンダリング検証

E2E テスト

Timer → 保存 → History タブ → 該当行確認

ステップ7：可視化 & 分析機能（完了）

Recharts を導入し、FocusTimeChart, TagPieChart コンポーネント実装

groupSessionsByPeriod, groupTagsBySessions をユーティリティ化し純粋関数テストを完了

履歴画面にグラフ切り替え UI を実装

E2Eテスト：履歴タブ → 期間別グラフタブ → チャートコンテナ数確認、タグ別グラフタブ → 円グラフコンテナ確認 を追加必要

ステップ8：設定・エクスポート機能

CSV エクスポート／インポート機能の追加

データバックアップ／リストア機能の実装

ユーザー設定画面（テーマ切替、通知設定）へのエクスポートボタン追加

ステップ9：リファクタリング & デザインスプリント

UI デザイン一新（色・タイポ・レイアウト）

コンポーネントの再利用性向上

Figma 等でハイファイモック作成

スタイルガイド／デザイントークン整備

CSV エクスポート／インポート機能の追加

データバックアップ／リストア機能の実装

ユーザー設定画面（テーマ切替、通知設定）へのエクスポートボタン追加

ステップ9：リファクタリング & デザインスプリント

UI デザイン一新（色・タイポ・レイアウト）

コンポーネントの再利用性向上

Figma 等でハイファイモック作成

スタイルガイド／デザイントークン整備

CSV エクスポート/インポート

データバックアップ/リストア

ユーザー設定画面（テーマ切替、通知設定など）

ステップ9：リファクタリング & デザインスプリント

UI デザイン一新（色・タイポ・レイアウト）

コンポーネントの再利用性向上

Figma 等でハイファイモック作成

スタイルガイド／デザイントークン整備

このドキュメントをもとに、プロジェクトの全体像と進捗を把握しながら開発を進めてください。

