import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton, useSidebar,
} from './Sidebar';

const setup = (props: { defaultOpen?: boolean; onOpenChange?: (o: boolean) => void } = {}) =>
  render(
    <SidebarProvider {...props}>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard" isActive>
                <span data-testid="icon">I</span>
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>,
  );

describe('Sidebar', () => {
  it('throws when useSidebar is used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useSidebar())).toThrow(/SidebarProvider/);
    spy.mockRestore();
  });

  it('starts expanded by default', () => {
    const { container } = setup();
    expect(container.querySelector('[data-sidebar-state]')).toHaveAttribute('data-sidebar-state', 'expanded');
  });

  it('respects defaultOpen={false}', () => {
    const { container } = setup({ defaultOpen: false });
    expect(container.querySelector('[data-sidebar-state]')).toHaveAttribute('data-sidebar-state', 'collapsed');
  });

  it('toggles through the trigger and notifies onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { container } = setup({ onOpenChange });
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector('[data-sidebar-state]')).toHaveAttribute('data-sidebar-state', 'collapsed');
  });

  it('toggles with the Ctrl+B shortcut', () => {
    const { container } = setup();
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
    expect(container.querySelector('[data-sidebar-state]')).toHaveAttribute('data-sidebar-state', 'collapsed');
  });

  it('marks the active menu button', () => {
    setup();
    expect(screen.getByRole('button', { name: /Dashboard/ })).toHaveAttribute('data-active', 'true');
  });

  it('keeps an accessible name on menu buttons when collapsed', () => {
    setup({ defaultOpen: false });
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
  });
});
