import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TreeView, type TreeNode } from './TreeView';

const data: TreeNode[] = [
  { id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] },
  { id: 'readme', label: 'README.md' },
  { id: 'locked', label: 'locked.txt', disabled: true },
];

describe('TreeView', () => {
  it('renders root nodes with tree role', () => {
    render(<TreeView data={data} />);
    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.queryByText('App.tsx')).not.toBeInTheDocument();
  });

  it('expands a folder on click and reports selection', () => {
    const onSelect = vi.fn();
    render(<TreeView data={data} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('src'));
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledWith('src');
  });

  it('respects defaultExpanded', () => {
    render(<TreeView data={data} defaultExpanded={['src']} />);
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
  });

  it('toggles with keyboard arrows', () => {
    render(<TreeView data={data} />);
    const row = screen.getByText('src').parentElement as HTMLElement;
    fireEvent.keyDown(row, { key: 'ArrowRight' });
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
    fireEvent.keyDown(row, { key: 'ArrowLeft' });
    expect(screen.queryByText('App.tsx')).not.toBeInTheDocument();
  });

  it('marks selected item and exposes aria-expanded', () => {
    render(<TreeView data={data} selectedId="readme" defaultExpanded={['src']} />);
    const items = screen.getAllByRole('treeitem');
    expect(items[0]).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('README.md').closest('[role="treeitem"]')).toHaveAttribute('aria-selected', 'true');
  });

  it('ignores clicks on disabled nodes', () => {
    const onSelect = vi.fn();
    render(<TreeView data={data} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('locked.txt'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
