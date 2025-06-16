import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../src/App';

describe('App コンポーネント', () => {
  beforeAll(() => {
    (window as any).api = {
      saveSession: jest.fn(() => Promise.resolve()),
      listSessions: jest.fn(() => Promise.resolve([])),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期表示はタイマー画面であること', () => {
    render(<App />);
    expect(screen.getByTestId('timer-display')).toBeInTheDocument();
    expect(screen.queryByText('作業履歴')).not.toBeInTheDocument();
  });

  it('ナビゲーションをクリックすると履歴画面に切り替わること', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /履歴/i }));
    await waitFor(() => expect(screen.getByText('作業履歴')).toBeInTheDocument());
    expect(screen.getByText('記録がありません。')).toBeInTheDocument();
  });

  it('タイマー画面に戻ると TimerDisplay が再度表示されること', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /履歴/i }));
    await waitFor(() => expect(screen.getByText('作業履歴')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    expect(screen.getByTestId('timer-display')).toBeInTheDocument();
  });
});
