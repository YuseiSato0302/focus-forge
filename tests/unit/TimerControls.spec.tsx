import { render, screen, fireEvent } from '@testing-library/react';
import { TimerControls } from '../../src/components/TimerControls';

describe('TimerControls', () => {
  const onStart = jest.fn();
  const onPause = jest.fn();
  const onResume = jest.fn();
  const onReset = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it('shows Start and Resume when not running', () => {
    render(<TimerControls isRunning={false} onStart={onStart} onPause={onPause} onResume={onResume} onReset={onReset} />);
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('shows Pause when running', () => {
    render(<TimerControls isRunning={true} onStart={onStart} onPause={onPause} onResume={onResume} onReset={onReset} />);
    expect(screen.queryByText('Start')).toBeNull();
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('calls correct callbacks on button clicks', () => {
    render(<TimerControls isRunning={false} onStart={onStart} onPause={onPause} onResume={onResume} onReset={onReset} />);
    fireEvent.click(screen.getByText('Start'));
    expect(onStart).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Resume'));
    expect(onResume).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Reset'));
    expect(onReset).toHaveBeenCalled();
  });
});