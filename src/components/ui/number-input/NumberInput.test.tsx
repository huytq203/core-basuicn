import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('renders label and description', () => {
    render(<NumberInput label="Quantity" description="Pick a number" />);
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Pick a number')).toBeInTheDocument();
  });

  it('shows error instead of description', () => {
    render(<NumberInput description="Hint" error="Too high" />);
    expect(screen.getByText('Too high')).toBeInTheDocument();
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('increments and decrements through accessible buttons', () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={5} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenLastCalledWith(6);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it('disables both buttons when disabled', () => {
    render(<NumberInput disabled />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });

  it('does not exceed max', () => {
    render(<NumberInput defaultValue={10} max={10} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });
});
