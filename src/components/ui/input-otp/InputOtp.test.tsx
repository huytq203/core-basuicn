import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputOTP } from './InputOtp';

describe('InputOTP', () => {
  it('renders one input per digit with accessible labels', () => {
    render(<InputOTP length={4} />);
    expect(screen.getByRole('group', { name: 'OTP Input' })).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    expect(screen.getByLabelText('Digit 1 of 4')).toBeInTheDocument();
  });

  it('uses the label as group name', () => {
    render(<InputOTP label="Verification code" />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument();
  });

  it('calls onChange and onComplete when typing', () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    render(<InputOTP length={3} onChange={onChange} onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText('Digit 1 of 3'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Digit 2 of 3'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Digit 3 of 3'), { target: { value: '3' } });
    expect(onChange).toHaveBeenLastCalledWith('123');
    expect(onComplete).toHaveBeenCalledWith('123');
  });

  it('rejects non-numeric characters in numeric mode', () => {
    const onChange = vi.fn();
    render(<InputOTP length={3} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Digit 1 of 3'), { target: { value: 'a' } });
    expect(onChange).not.toHaveBeenCalledWith('a');
  });

  it('shows the error message and marks inputs invalid', () => {
    render(<InputOTP length={2} error errorMessage="Wrong code" />);
    expect(screen.getByText('Wrong code')).toBeInTheDocument();
    expect(screen.getByLabelText('Digit 1 of 2')).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables every input when disabled', () => {
    render(<InputOTP length={2} disabled />);
    screen.getAllByRole('textbox').forEach((el) => expect(el).toBeDisabled());
  });
});
