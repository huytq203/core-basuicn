import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './Resizable';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

describe('Resizable', () => {
  it('renders panels and a handle with separator role', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel id="a" defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle id="h" />
        <ResizablePanel id="b" defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('supports vertical direction', () => {
    render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel id="a" defaultSize={50}>Top</ResizablePanel>
        <ResizableHandle id="h" />
        <ResizablePanel id="b" defaultSize={50}>Bottom</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
  });

  it('merges custom className on the panel', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel id="a" className="custom-panel">X</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(screen.getByText('X')).toHaveClass('custom-panel');
  });
});
