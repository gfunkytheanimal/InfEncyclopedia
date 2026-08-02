import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Frame } from "./Frame";
import type { ThemeNode } from "../types";

// Mock child components to isolate Frame logic
vi.mock("./SplatBackground", () => ({
  SplatBackground: () => <div data-testid="splat-background" />,
}));
vi.mock("./BackgroundArt", () => ({
  BackgroundArt: () => <div data-testid="background-art" />,
}));
vi.mock("./ParticleLayer", () => ({
  ParticleLayer: () => <div data-testid="particle-layer" />,
}));
vi.mock("./FactCallout", () => ({
  FactCallout: ({ fact }: any) => <div data-testid="fact-callout">{fact.text}</div>,
}));

describe("Frame", () => {
  const mockNode: ThemeNode = {
    id: "root",
    title: "Root Node",
    motifs: [],
    particles: { type: "none", density: 0 },
    facts: [{ text: "Fact 1", slot: "top" }],
  };

  it("renders base components", () => {
    render(
      <Frame
        node={mockNode}
        scale={1}
        frameSize={100}
        depthRemaining={2}
        parentZoom={1}
      />
    );

    expect(screen.getByTestId("splat-background")).toBeInTheDocument();
    expect(screen.getByTestId("background-art")).toBeInTheDocument();
    expect(screen.getByTestId("particle-layer")).toBeInTheDocument();
    expect(screen.getByTestId("fact-callout")).toHaveTextContent("Fact 1");
  });

  it("recursively renders child Frame when node.child exists and depthRemaining > 0", () => {
    const nodeWithChild: ThemeNode = {
      ...mockNode,
      id: "parent",
      child: {
        ...mockNode,
        id: "child",
        facts: [{ text: "Child Fact", slot: "top" }],
      },
    };

    render(
      <Frame
        node={nodeWithChild}
        scale={1}
        frameSize={100}
        depthRemaining={1}
        parentZoom={1}
      />
    );

    // Should render the parent fact and the child fact
    expect(screen.getByText("Fact 1")).toBeInTheDocument();
    expect(screen.getByText("Child Fact")).toBeInTheDocument();
  });

  it("stops recursion when depthRemaining is 0 even if node.child exists", () => {
    const nodeWithChild: ThemeNode = {
      ...mockNode,
      id: "parent",
      child: {
        ...mockNode,
        id: "child",
        facts: [{ text: "Child Fact", slot: "top" }],
      },
    };

    render(
      <Frame
        node={nodeWithChild}
        scale={1}
        frameSize={100}
        depthRemaining={0}
        parentZoom={1}
      />
    );

    // Should only render the parent fact, child frame should not be rendered
    expect(screen.getByText("Fact 1")).toBeInTheDocument();
    expect(screen.queryByText("Child Fact")).not.toBeInTheDocument();
  });

  it("stops recursion when node.child is undefined", () => {
    render(
      <Frame
        node={mockNode}
        scale={1}
        frameSize={100}
        depthRemaining={5}
        parentZoom={1}
      />
    );

    // Just verifying it renders without crashing
    expect(screen.getByText("Fact 1")).toBeInTheDocument();
  });
});
