import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Timeline } from './Timeline';

const items = [
  { title: 'Created', description: 'Order placed', time: '09:00' },
  { title: 'Shipped', variant: 'success' as const },
  { title: 'Delivered' },
];

describe('Timeline', () => {
  it('renders a list with one listitem per entry', () => {
    render(<Timeline items={items} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders title, description and time', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Order placed')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('omits optional text when not provided', () => {
    render(<Timeline items={[{ title: 'Only title' }]} />);
    expect(screen.getByText('Only title')).toBeInTheDocument();
    expect(screen.getAllByText(/./)).toHaveLength(1);
  });

  it('renders a custom icon inside the indicator', () => {
    render(<Timeline items={[{ title: 'Icon', icon: <svg data-testid="icon" /> }]} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Timeline items={items} className="custom" />);
    expect(screen.getByRole('list')).toHaveClass('custom');
  });
});
