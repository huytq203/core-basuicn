import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toaster } from './Toaster';

describe('Toaster', () => {
  it('mounts without crashing and exposes a notifications region', () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector('section[aria-label*="otification"]')).toBeInTheDocument();
  });

  it('accepts passthrough props', () => {
    expect(() => render(<Toaster position="top-center" richColors />)).not.toThrow();
  });
});
