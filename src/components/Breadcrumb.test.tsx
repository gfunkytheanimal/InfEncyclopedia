import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Breadcrumb } from "./Breadcrumb";
import type { ThemeNode } from "../types";

describe("Breadcrumb Component", () => {
  it("renders an empty path without errors", () => {
    const { container } = render(<Breadcrumb path={[]} />);
    expect(container.querySelector(".breadcrumb")).toBeInTheDocument();
    expect(container.querySelector(".breadcrumb")?.innerHTML).toBe("");
  });

  it("renders a single item correctly", () => {
    const path: ThemeNode[] = [
      { id: "root", title: "Root Node" } as ThemeNode,
    ];
    render(<Breadcrumb path={path} />);

    const curElement = screen.getByText("Root Node");
    expect(curElement).toBeInTheDocument();
    expect(curElement).toHaveClass("breadcrumb-cur");
    expect(screen.queryByText("›")).not.toBeInTheDocument();
  });

  it("renders multiple items correctly with separators", () => {
    const path: ThemeNode[] = [
      { id: "root", title: "Root Node" } as ThemeNode,
      { id: "child1", title: "Child Node 1" } as ThemeNode,
      { id: "child2", title: "Child Node 2" } as ThemeNode,
    ];
    render(<Breadcrumb path={path} />);

    // Check all previous nodes
    const rootElement = screen.getByText("Root Node");
    expect(rootElement).toBeInTheDocument();
    expect(rootElement).toHaveClass("breadcrumb-prev");

    const child1Element = screen.getByText("Child Node 1");
    expect(child1Element).toBeInTheDocument();
    expect(child1Element).toHaveClass("breadcrumb-prev");

    // Check current node
    const child2Element = screen.getByText("Child Node 2");
    expect(child2Element).toBeInTheDocument();
    expect(child2Element).toHaveClass("breadcrumb-cur");

    // Check separators
    const separators = screen.getAllByText("›");
    expect(separators.length).toBe(2);
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb';
import type { ThemeNode } from '../types';

const mockNode = (id: string, title: string): ThemeNode => ({
  id,
  title,
  motifs: [],
  particles: { type: 'none', density: 0 },
  facts: []
});

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

describe('Breadcrumb', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders an empty breadcrumb trail for an empty path', () => {
    const { container } = render(<Breadcrumb path={[]} />);
    expect(container.firstChild).toHaveClass('breadcrumb');
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders a single item correctly', () => {
    render(<Breadcrumb path={[mockNode('1', 'Home')]} />);
    const item = screen.getByText('Home');
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('breadcrumb-cur');
    expect(screen.queryByText('›')).not.toBeInTheDocument();
  });

  it('renders multiple items with correct classes and separators', () => {
    render(<Breadcrumb path={[
      mockNode('1', 'Home'),
      mockNode('2', 'Category'),
      mockNode('3', 'Subcategory')
    ]} />);

    const home = screen.getByText('Home');
    expect(home).toHaveClass('breadcrumb-prev');

    const category = screen.getByText('Category');
    expect(category).toHaveClass('breadcrumb-prev');

    const subcategory = screen.getByText('Subcategory');
    expect(subcategory).toHaveClass('breadcrumb-cur');

    const separators = screen.getAllByText('›');
    expect(separators).toHaveLength(2);
  });
});
