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
  });
});
