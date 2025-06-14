import { render, screen, fireEvent } from '@testing-library/react';
import { TimerSettings } from '../../src/components/TimerSettings';
import { TimerConfig } from '../../src/timerConfig';

describe('TimerSettings', () => {
  it('renders initial values and calls onChange with new config', () => {
    const initialConfig = new TimerConfig({ cycles: 3, workDuration: 25, breakDuration: 5 });
    const onChange = jest.fn();
    render(<TimerSettings config={initialConfig} onChange={onChange} />);

    const inputCycles = screen.getByTestId('input-cycles') as HTMLInputElement;
    const inputWork = screen.getByTestId('input-work') as HTMLInputElement;
    const inputBreak = screen.getByTestId('input-break') as HTMLInputElement;
    const applyButton = screen.getByTestId('button-apply');

    expect(inputCycles.value).toBe('3');
    expect(inputWork.value).toBe('25');
    expect(inputBreak.value).toBe('5');

    fireEvent.change(inputCycles, { target: { value: '4' }});
    fireEvent.change(inputWork, { target: { value: '30' }});
    fireEvent.change(inputBreak, { target: { value: '6' }});
    fireEvent.click(applyButton);

    expect(onChange).toHaveBeenCalledWith(new TimerConfig({ cycles: 4, workDuration: 30, breakDuration: 6 }));
  });
});