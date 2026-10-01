import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PreviewCard } from './PreviewCard';

describe('PreviewCard', () => {
  it('renders the trigger and keeps the card closed by default', () => {
    render(<PreviewCard trigger={<a href="#x">@user</a>} title="User" />);
    expect(screen.getByText('@user')).toBeInTheDocument();
    expect(screen.queryByText('User')).not.toBeInTheDocument();
  });

  it('opens on click and shows title, description, footer', async () => {
    render(
      <PreviewCard
        trigger={<span>Hover me</span>}
        title="Card title"
        description="Card description"
        footerContent={<span>Footer</span>}
      />,
    );
    fireEvent.click(screen.getByText('Hover me'));
    expect(await screen.findByText('Card title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('opens on hover when openOnHover is set', async () => {
    render(<PreviewCard openOnHover trigger={<span>Target</span>} title="Hovered" />);
    fireEvent.mouseEnter(screen.getByText('Target').parentElement as HTMLElement);
    expect(await screen.findByText('Hovered')).toBeInTheDocument();
  });

  it('renders the cover image with alt text', async () => {
    render(<PreviewCard trigger={<span>T</span>} coverImage="/c.png" coverAlt="Cover" title="x" />);
    fireEvent.click(screen.getByText('T'));
    expect(await screen.findByAltText('Cover')).toHaveAttribute('src', '/c.png');
  });
});
