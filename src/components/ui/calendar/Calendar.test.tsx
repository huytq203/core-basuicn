import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from './Calendar';

const may2026 = new Date(2026, 4, 15);

describe('Calendar', () => {
  it('renders a grid of days for the selected month', () => {
    render(<Calendar selected={may2026} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell').length).toBeGreaterThanOrEqual(28);
  });

  it('marks the selected day', () => {
    render(<Calendar selected={may2026} />);
    expect(screen.getByRole('button', { name: /May 15th, 2026/ }).closest('td')).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onSelect with the clicked date in single mode', () => {
    const onSelect = vi.fn();
    render(<Calendar selected={may2026} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /May 20th, 2026/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0][0] as Date).getDate()).toBe(20);
  });

  it('renders multiple months', () => {
    render(<Calendar selected={may2026} numberOfMonths={2} />);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  it('does not select anything when disabled', () => {
    const onSelect = vi.fn();
    render(<Calendar selected={may2026} disabled onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /May 20th, 2026/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('forwards the ref to the wrapper', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Calendar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('month / year quick pick', () => {
    it('jumps to another year and month via the header', () => {
      render(<Calendar selected={may2026} />);
      fireEvent.click(screen.getByRole('button', { name: 'Choose year' }));
      fireEvent.click(screen.getByRole('button', { name: '2030' }));
      fireEvent.click(screen.getByRole('button', { name: 'March' }));
      expect(screen.getByRole('button', { name: 'Choose year' })).toHaveTextContent('2030');
      expect(screen.getByRole('button', { name: 'Choose month' })).toHaveTextContent('March');
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('lists 12 months in the month grid and marks the current one', () => {
      render(<Calendar selected={may2026} />);
      fireEvent.click(screen.getByRole('button', { name: 'Choose month' }));
      expect(screen.getByRole('button', { name: 'May' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getAllByRole('button', { name: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ })).toHaveLength(12);
    });

    it('pages the year grid by 12 years', () => {
      render(<Calendar selected={may2026} />);
      fireEvent.click(screen.getByRole('button', { name: 'Choose year' }));
      expect(screen.getByRole('button', { name: '2022' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Previous 12 years' }));
      expect(screen.getByRole('button', { name: '2010' })).toBeInTheDocument();
    });

    it('respects fromYear and toYear', () => {
      render(<Calendar selected={may2026} fromYear={2025} toYear={2027} />);
      fireEvent.click(screen.getByRole('button', { name: 'Choose year' }));
      expect(screen.getByRole('button', { name: '2022' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '2026' })).toBeEnabled();
    });
  });

  it('lets two panels pick months independently and keeps them ordered', () => {
    render(<Calendar mode="range" numberOfMonths={2} selected={{ from: may2026, to: may2026 }} />);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    const [leftYear, rightYear] = screen.getAllByRole('button', { name: 'Choose year' });
    expect(leftYear).toHaveTextContent('2026');
    expect(rightYear).toHaveTextContent('2026');
    fireEvent.click(rightYear);
    fireEvent.click(screen.getByRole('button', { name: '2028' }));
    fireEvent.click(screen.getByRole('button', { name: 'June' }));
    const [lMonth, rMonth] = screen.getAllByRole('button', { name: 'Choose month' });
    expect(lMonth).toHaveTextContent('May');
    expect(rMonth).toHaveTextContent('June');
    expect(screen.getAllByRole('button', { name: 'Choose year' })[1]).toHaveTextContent('2028');
  });
});
