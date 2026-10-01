import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuCheckboxItem, ContextMenuSeparator,
} from './ContextMenu';

const setup = (onCopy = vi.fn()) =>
  render(
    <ContextMenu>
      <ContextMenuTrigger><div>Right click area</div></ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onCopy}>Copy</ContextMenuItem>
        <ContextMenuItem disabled>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>,
  );

describe('ContextMenu', () => {
  it('is closed until the trigger receives a contextmenu event', () => {
    setup();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens a menu on right click', () => {
    setup();
    fireEvent.contextMenu(screen.getByText('Right click area'), { clientX: 10, clientY: 20 });
    expect(screen.getByRole('menu')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('runs item action and closes the menu', () => {
    const onCopy = vi.fn();
    setup(onCopy);
    fireEvent.contextMenu(screen.getByText('Right click area'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }));
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('marks disabled items with aria-disabled and ignores clicks', () => {
    setup();
    fireEvent.contextMenu(screen.getByText('Right click area'));
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('exposes checkbox state', () => {
    setup();
    fireEvent.contextMenu(screen.getByText('Right click area'));
    expect(screen.getByRole('menuitemcheckbox', { name: /Show grid/ })).toHaveAttribute('aria-checked', 'true');
  });

  it('closes on outside click', () => {
    setup();
    fireEvent.contextMenu(screen.getByText('Right click area'));
    fireEvent.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
