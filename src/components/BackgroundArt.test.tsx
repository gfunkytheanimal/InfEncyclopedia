import { render, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { BackgroundArt } from './BackgroundArt';
import type { ThemeNode } from '../types';

const mockNode = (id: string, title: string, artRef?: string): ThemeNode => ({
  id,
  title,
  artRef,
  motifs: [],
  particles: { type: 'none', density: 0 },
  facts: []
});

describe('BackgroundArt', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders PlaceholderArt and no img when artRef is absent', () => {
    const node = mockNode('1', 'Test Node');
    const { container } = render(<BackgroundArt node={node} size={100} />);

    // Check if PlaceholderArt SVG is rendered
    expect(container.querySelector('.placeholder-art')).toBeInTheDocument();

    // Check that img is NOT rendered
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders img with opacity 0 initially when artRef is present', () => {
    const node = mockNode('2', 'Art Node', 'image.jpg');
    const { container } = render(<BackgroundArt node={node} size={100} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'image.jpg');

    // Check initial opacity style
    expect(img).toHaveStyle({ opacity: '0' });
  });

  it('changes img opacity to 1 on load', () => {
    const node = mockNode('3', 'Art Node', 'image.jpg');
    const { container } = render(<BackgroundArt node={node} size={100} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveStyle({ opacity: '0' });

    fireEvent.load(img!);

    expect(img).toHaveStyle({ opacity: '1' });
  });

  it('changes img opacity to 0 on error', () => {
    const node = mockNode('4', 'Art Node', 'image.jpg');
    const { container } = render(<BackgroundArt node={node} size={100} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();

    // First simulate load to change opacity to 1
    fireEvent.load(img!);
    expect(img).toHaveStyle({ opacity: '1' });

    // Then simulate error
    fireEvent.error(img!);
    expect(img).toHaveStyle({ opacity: '0' });
  });
});
