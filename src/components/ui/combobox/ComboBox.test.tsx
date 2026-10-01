import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComboBox } from './ComboBox';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('ComboBox', () => {
  it('renders label, placeholder and required marker', () => {
    render(<ComboBox options={options} label="Fruit" placeholder="Pick fruit" required />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pick fruit')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows the error message', () => {
    render(<ComboBox options={options} error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('exposes a combobox role', () => {
    render(<ComboBox options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('lists options when focused and selects one', async () => {
    const onValueChange = vi.fn();
    render(<ComboBox options={options} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.click(await screen.findByRole('option', { name: 'Banana' }));
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('shows the label of the default value in the input', () => {
    render(<ComboBox options={options} defaultValue="cherry" />);
    expect(screen.getByRole('combobox')).toHaveValue('Cherry');
  });
});
