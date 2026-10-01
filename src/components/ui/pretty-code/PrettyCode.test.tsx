import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrettyCode } from './PrettyCode';

describe('PrettyCode', () => {
  it('shows the filename in the header', async () => {
    render(<PrettyCode code="const a = 1;" filename="a.ts" lang="ts" />);
    expect(await screen.findByText('a.ts')).toBeInTheDocument();
  });

  it('renders highlighted code text after loading', async () => {
    render(<PrettyCode code="const answer = 42;" lang="ts" />);
    expect(await screen.findByText(/answer/, {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it('provides a copy button', async () => {
    render(<PrettyCode code="x" lang="ts" />);
    expect(await screen.findByRole('button')).toBeInTheDocument();
  });
});
