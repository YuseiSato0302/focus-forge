import { render, screen, waitFor } from '@testing-library/react';
import { HistoryList } from '../../src/components/HistoryList';
import { WorkSession } from '../../src/db';

describe('HistoryList コンポーネント', () => {
  const mockSessions: WorkSession[] = [
    {
      id: '1',
      title: 'Session One',
      started_at: new Date('2025-06-15T10:00:00Z'),
      ended_at: new Date('2025-06-15T10:25:00Z'),
      duration_minutes: 25,
      tags: ['focus'],
      created_at: new Date('2025-06-15T10:25:00Z'),
    },
    {
      id: '2',
      title: 'Session Two',
      started_at: new Date('2025-06-16T11:00:00Z'),
      ended_at: new Date('2025-06-16T11:15:00Z'),
      duration_minutes: 15,
      tags: ['study', 'break'],
      created_at: new Date('2025-06-16T11:15:00Z'),
    },
  ];

  beforeAll(() => {
    window.api = {
      listSessions: jest.fn(() => Promise.resolve(mockSessions)),
    } as any;
  });

  it('読み込み中表示を出し、セッションをロード後にテーブルが描画される', async () => {
    render(<HistoryList />);
    // 初期は "読み込み中..." を表示
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();

    // ロード完了を待つ
    await waitFor(() => expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument());

    // テーブルヘッダー
    expect(screen.getByText('作業履歴')).toBeInTheDocument();
    expect(screen.getByText('日付')).toBeInTheDocument();
    expect(screen.getByText('タイトル')).toBeInTheDocument();
    expect(screen.getByText('時間 (分)')).toBeInTheDocument();
    expect(screen.getByText('タグ')).toBeInTheDocument();

    // 各セッション行の検証
    mockSessions.forEach(session => {
      const dateStr = session.created_at!.toLocaleString();
      expect(screen.getByText(dateStr)).toBeInTheDocument();
      expect(screen.getByText(session.title)).toBeInTheDocument();
      expect(screen.getByText(session.duration_minutes.toString())).toBeInTheDocument();
      session.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  it('セッションが空の場合は "記録がありません。" を表示する', async () => {
    // 空の配列を返すように変更
    (window.api.listSessions as jest.Mock).mockResolvedValueOnce([]);

    render(<HistoryList />);
    await waitFor(() => expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument());

    expect(screen.getByText('記録がありません。')).toBeInTheDocument();
  });
});
