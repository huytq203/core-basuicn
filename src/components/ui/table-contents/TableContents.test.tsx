import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TableContents } from './TableContents';

const items = [
  { id: 'intro', label: 'Introduction' },
  { id: 'usage', label: 'Usage', level: 2 as const },
  { id: 'api', label: 'API', level: 3 as const },
];

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  });
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

describe('TableContents', () => {
  it('renders a labelled navigation landmark', () => {
    render(<TableContents items={items} />);
    expect(screen.getByRole('navigation', { name: 'Table of contents' })).toBeInTheDocument();
  });

  it('renders every item', () => {
    render(<TableContents items={items} />);
    items.forEach((i) => expect(screen.getByText(i.label)).toBeInTheDocument());
  });

  it('renders the optional title', () => {
    render(<TableContents items={items} title="On this page" />);
    expect(screen.getByText('On this page')).toBeInTheDocument();
  });

  it('scrolls to the target section on click', () => {
    const section = document.createElement('section');
    section.id = 'usage';
    document.body.appendChild(section);
    render(<TableContents items={items} offset={80} />);
    fireEvent.click(screen.getByText('Usage'));
    expect(window.scrollTo).toHaveBeenCalled();
    section.remove();
  });
});
