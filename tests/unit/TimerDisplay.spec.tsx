import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimerDisplay } from '../../src/components/TimerDisplay';

describe('TimerDisplay', () => {
  it('renders remainingSeconds with two decimal places and current cycle', () => {
    render(<TimerDisplay remainingSeconds={65.5} currentCycle={2} />);
    const container = screen.getByTestId('timer-display');
    expect(container).toHaveTextContent('65.50');
    expect(container).toHaveTextContent('Cycle 2');
  });
});