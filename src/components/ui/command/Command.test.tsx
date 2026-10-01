import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from './Command';

const setup = (onSelect = vi.fn()) =>
  render(
    <Command open>
      <CommandInput />
      <CommandList>
        <CommandEmpty>Nothing here</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="calendar" onSelect={onSelect}>Calendar</CommandItem>
          <CommandItem value="search">Search</CommandItem>
          <CommandItem value="locked" disabled>Locked</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>,
  );

describe('Command', () => {
  it('renders input, group heading and items when open', () => {
    setup();
    expect(screen.getByPlaceholderText('Type a command or search...')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders nothing when closed', () => {
    render(<Command open={false}><CommandInput /></Command>);
    expect(screen.queryByPlaceholderText('Type a command or search...')).not.toBeInTheDocument();
  });

  it('filters items by search text', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Type a command or search...'), { target: { value: 'cal' } });
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });

  it('shows the empty state when nothing matches', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Type a command or search...'), { target: { value: 'zzz' } });
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('calls onSelect on click and Enter, but not for disabled items', () => {
    const onSelect = vi.fn();
    setup(onSelect);
    fireEvent.click(screen.getByText('Calendar'));
    fireEvent.keyDown(screen.getByText('Calendar'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(2);
    const locked = screen.getByText('Locked');
    expect(locked).toHaveAttribute('aria-disabled', 'true');
  });
});
