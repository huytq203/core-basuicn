import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { Table } from './Table';

interface Row { id: number; name: string; age: number }

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const data: Row[] = Array.from({ length: 25 }, (_, i) => ({ id: i, name: `User ${i}`, age: 20 + i }));

describe('Table', () => {
  it('renders headers and rows', () => {
    render(<Table data={data.slice(0, 3)} columns={columns} pagination={false} />);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByText('User 0')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('shows the default empty text and a custom one', () => {
    const { rerender } = render(<Table data={[]} columns={columns} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    rerender(<Table data={[]} columns={columns} labels={{ empty: 'Nothing yet' }} />);
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
  });

  it('paginates client-side with 10 rows per page by default', () => {
    render(<Table data={data} columns={columns} />);
    expect(screen.getByText('User 9')).toBeInTheDocument();
    expect(screen.queryByText('User 10')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('User 10')).toBeInTheDocument();
  });

  it('exposes labelled pagination controls', () => {
    render(<Table data={data} columns={columns} />);
    ['First page', 'Previous page', 'Next page', 'Last page'].forEach((n) =>
      expect(screen.getByRole('button', { name: n })).toBeInTheDocument(),
    );
  });

  it('sets aria-sort and sorts when a header is clicked', () => {
    render(<Table data={data.slice(0, 3)} columns={columns} pagination={false} />);
    const header = screen.getByRole('columnheader', { name: /Age/ });
    fireEvent.click(within(header).getByText('Age'));
    expect(header).toHaveAttribute('aria-sort');
  });

  it('reports selected rows when row selection is enabled', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table data={data.slice(0, 3)} columns={columns} pagination={false}
        enableRowSelection onSelectionChange={onSelectionChange} />,
    );
    const boxes = screen.getAllByRole('checkbox');
    fireEvent.click(boxes[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([data[0]]);
  });
});
