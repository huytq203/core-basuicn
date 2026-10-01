import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Autocomplete } from './Autocomplete';

const options = [
  { label: 'Hanoi', value: 'hanoi', description: 'Capital' },
  { label: 'Hue', value: 'hue' },
  { label: 'Saigon', value: 'saigon' },
];

describe('Autocomplete', () => {
  it('renders label and placeholder', () => {
    render(<Autocomplete options={options} label="City" placeholder="Search city" />);
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search city')).toBeInTheDocument();
  });

  it('exposes a combobox role', () => {
    render(<Autocomplete options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('filters suggestions while typing', async () => {
    render(<Autocomplete options={options} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sai' } });
    expect(await screen.findByRole('option', { name: /Saigon/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Hanoi/ })).not.toBeInTheDocument();
  });

  it('reports the chosen value', async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete options={options} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ha' } });
    fireEvent.click(await screen.findByRole('option', { name: /Hanoi/ }));
    expect(onValueChange).toHaveBeenCalled();
  });

  it('shows the empty text when nothing matches', async () => {
    render(<Autocomplete options={options} emptyText="Nothing found" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'qqq' } });
    expect(await screen.findByText('Nothing found')).toBeInTheDocument();
  });
});
