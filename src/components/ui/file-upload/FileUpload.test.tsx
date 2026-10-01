import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from './FileUpload';

const file = (name: string, size = 10, type = 'text/plain') =>
  new File([new Uint8Array(size)], name, { type });

const getInput = (container: HTMLElement) => container.querySelector('input[type="file"]') as HTMLInputElement;

describe('FileUpload', () => {
  it('renders the default dropzone copy and description', () => {
    render(<FileUpload description="PNG up to 2MB" />);
    expect(screen.getByText(/Drop files here or/)).toBeInTheDocument();
    expect(screen.getByText('PNG up to 2MB')).toBeInTheDocument();
  });

  it('renders label and error', () => {
    render(<FileUpload label="Avatar" error="Required" />);
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('forwards accept and multiple to the input', () => {
    const { container } = render(<FileUpload accept="image/*" multiple />);
    const input = getInput(container);
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input.multiple).toBe(true);
  });

  it('reports selected files', () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload onChange={onChange} />);
    fireEvent.change(getInput(container), { target: { files: [file('a.txt')] } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as File[])[0].name).toBe('a.txt');
  });

  it('rejects files above maxSize via onError', () => {
    const onChange = vi.fn();
    const onError = vi.fn();
    const { container } = render(<FileUpload maxSize={5} onChange={onChange} onError={onError} />);
    fireEvent.change(getInput(container), { target: { files: [file('big.txt', 50)] } });
    expect(onError).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('lists current files with an accessible remove button', () => {
    const onChange = vi.fn();
    render(<FileUpload value={[file('doc.txt')]} onChange={onChange} />);
    expect(screen.getByText('doc.txt')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove doc.txt' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('disables the input when disabled', () => {
    const { container } = render(<FileUpload disabled />);
    expect(getInput(container)).toBeDisabled();
  });
});
