import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';
import type { ThemeNode } from '../types';

describe('Breadcrumb', () => {
  it('renders an empty breadcrumb container when path is empty', () => {
    const { container } = render(<Breadcrumb path={[]} />);
    const breadcrumbDiv = container.querySelector('.breadcrumb');
    expect(breadcrumbDiv).toBeInTheDocument();
    expect(breadcrumbDiv?.childNodes).toHaveLength(0);
  });

  it('renders a single path node correctly', () => {
    const path: ThemeNode[] = [
      { id: '1', title: 'Home', motifs: [], particles: { type: 'none', density: 0 }, facts: [] }
    ];
    render(<Breadcrumb path={path} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveClass('breadcrumb-cur');
  });

  it('renders multiple path nodes with separators', () => {
    const path: ThemeNode[] = [
      { id: '1', title: 'Home', motifs: [], particles: { type: 'none', density: 0 }, facts: [] },
      { id: '2', title: 'Subcategory', motifs: [], particles: { type: 'none', density: 0 }, facts: [] }
    ];
    render(<Breadcrumb path={path} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveClass('breadcrumb-prev');
    expect(screen.getByText('Subcategory')).toBeInTheDocument();
    expect(screen.getByText('Subcategory')).toHaveClass('breadcrumb-cur');
    expect(screen.getByText('›')).toBeInTheDocument();
  });
});
