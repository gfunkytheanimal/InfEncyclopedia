import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PlaceholderArt } from "./PlaceholderArt";
import type { ThemeNode } from "../types";

describe("PlaceholderArt", () => {
  afterEach(() => {
    cleanup();
  });

  const mockNode: ThemeNode = {
    id: "test-node",
    title: "Test Title",
    motifs: [],
    particles: { type: "none", density: 0 },
    facts: [],
  };

  it("renders correctly with given size and node title", () => {
    const { container } = render(<PlaceholderArt node={mockNode} size={100} />);

    // Check if SVG is rendered with correct class and viewBox
    const svg = container.querySelector("svg.placeholder-art");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 100 100");

    // Check if the title is rendered
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("applies palette colors based on node id", () => {
    const { container } = render(<PlaceholderArt node={mockNode} size={100} />);

    // Test Title text should have fill color from palette.accent
    const textElement = screen.getByText("Test Title");
    expect(textElement).toHaveAttribute("fill");

    // The <g> tag with circles should also use palette.accent
    const groupElement = container.querySelector("g");
    expect(groupElement).toHaveAttribute("fill");

    // The gradients should exist and reference the id
    const defs = container.querySelector("defs");
    expect(defs).toBeInTheDocument();

    const grad1 = container.querySelector("#grad-test-node");
    expect(grad1).toBeInTheDocument();

    const grad2 = container.querySelector("#vig-test-node");
    expect(grad2).toBeInTheDocument();
  });

  it("renders multiple decorative circles", () => {
      const { container } = render(<PlaceholderArt node={mockNode} size={100} />);
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBe(8); // 8 circles defined in the component
  });
});
