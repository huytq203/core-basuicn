import { render } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { ChartLine, ChartBar, ChartArea, ChartPie, ChartTooltip } from './Chart';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const data = [
  { month: 'Jan', revenue: 100, cost: 40 },
  { month: 'Feb', revenue: 150, cost: 60 },
];
const series = [{ key: 'revenue', label: 'Revenue' }, { key: 'cost', label: 'Cost' }];

describe('Chart', () => {
  it('renders ChartLine inside a responsive container', () => {
    const { container } = render(<ChartLine data={data} xKey="month" series={series} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('renders ChartBar', () => {
    const { container } = render(<ChartBar data={data} xKey="month" series={series} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('renders ChartArea', () => {
    const { container } = render(<ChartArea data={data} xKey="month" series={series} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('renders ChartPie', () => {
    const { container } = render(<ChartPie data={[{ name: 'A', value: 1 }, { name: 'B', value: 2 }]} isAnimationActive={false} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('ChartTooltip renders nothing when inactive', () => {
    const { container } = render(<ChartTooltip active={false} payload={[]} label="x" coordinate={undefined} accessibilityLayer={false} activeIndex={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
