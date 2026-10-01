import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('renders label and placeholder', () => {
    render(<DatePicker label="Birthday" placeholder="Pick a day" />);
    expect(screen.getByText('Birthday')).toBeInTheDocument();
    expect(screen.getByText('Pick a day')).toBeInTheDocument();
  });

  it('shows description, or error instead of it', () => {
    const { rerender } = render(<DatePicker description="Hint" />);
    expect(screen.getByText('Hint')).toBeInTheDocument();
    rerender(<DatePicker description="Hint" error="Invalid date" />);
    expect(screen.getByText('Invalid date')).toBeInTheDocument();
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('opens the calendar and selects a date', async () => {
    const onChange = vi.fn();
    render(<DatePicker value={new Date(2026, 4, 15)} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(await screen.findByRole("button", { name: /ngày 20 tháng 05 năm 2026/ }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(20);
  });

  it('does not open when disabled', () => {
    render(<DatePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows the formatted time in time-only mode', () => {
    render(<DatePicker mode="time-only" timeValue="09:30:00" />);
    expect(screen.getByText('09:30:00')).toBeInTheDocument();
  });

  it('shows quick picks and applies one', async () => {
    const onChange = vi.fn();
    render(<DatePicker value={undefined} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(await screen.findByRole('button', { name: '7 ngày tới' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('can hide quick picks', async () => {
    render(<DatePicker presets={false} />);
    fireEvent.click(screen.getByRole('button'));
    await screen.findByRole('grid');
    expect(screen.queryByRole('button', { name: '7 ngày tới' })).not.toBeInTheDocument();
  });

  it('shows two month panels in range mode', async () => {
    render(<DatePicker mode="range" />);
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findAllByRole('grid')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Áp dụng' })).toBeInTheDocument();
  });

  it('offers hour/minute/second columns and reports the chosen time', async () => {
    const onChange = vi.fn();
    render(<DatePicker showTime value={new Date(2026, 4, 15, 9, 30, 0)} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(await screen.findByRole('listbox', { name: 'Giờ' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: 'Phút' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: 'Giây' })).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('listbox', { name: 'Giờ' })).getByRole('option', { name: '14' }));
    expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(14);
  });

  it('only renders the hour column for the HH format', async () => {
    render(<DatePicker mode="time-only" timeFormat="HH" />);
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('listbox', { name: 'Giờ' })).toBeInTheDocument();
    expect(screen.queryByRole('listbox', { name: 'Phút' })).not.toBeInTheDocument();
  });

  it('clears the value', async () => {
    const onChange = vi.fn();
    render(<DatePicker value={new Date(2026, 4, 15)} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(await screen.findByRole('button', { name: 'Xóa' }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('accepts custom labels', () => {
    render(<DatePicker labels={{ placeholder: 'Pick a date' }} />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });
});
