import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FactCallout } from "./FactCallout";
import type { Fact } from "../types";

describe("FactCallout", () => {
  const mockFact: Fact = {
    text: "This is a test fact",
    slot: "top-left",
  };

  it("renders the fact text", () => {
    render(<FactCallout fact={mockFact} parentZoom={2} />);
    expect(screen.getByText("This is a test fact")).toBeDefined();
  });

  it("applies the correct slot style and data attribute", () => {
    const { container } = render(<FactCallout fact={mockFact} parentZoom={2} />);
    const calloutDiv = container.querySelector(".fact-callout");
    expect(calloutDiv).toBeDefined();
    expect(calloutDiv?.getAttribute("data-slot")).toBe("top-left");
    // "top-left" has top: 5%, left: 5%
    expect(calloutDiv?.getAttribute("style")).toContain("top: 5%");
    expect(calloutDiv?.getAttribute("style")).toContain("left: 5%");
  });

  it("applies zero opacity when parentZoom is very low", () => {
    const { container } = render(<FactCallout fact={mockFact} parentZoom={0.1} />);
    const calloutDiv = container.querySelector(".fact-callout") as HTMLElement;
    expect(calloutDiv).toBeDefined();
    expect(calloutDiv.style.opacity).toBe("0");
  });

  it("applies full opacity when parentZoom is optimal", () => {
    const { container } = render(<FactCallout fact={mockFact} parentZoom={2} />);
    const calloutDiv = container.querySelector(".fact-callout") as HTMLElement;
    expect(calloutDiv).toBeDefined();
    expect(calloutDiv.style.opacity).toBe("1");
  });

  it("applies zero opacity when parentZoom is very high", () => {
    const { container } = render(<FactCallout fact={mockFact} parentZoom={6.0} />);
    const calloutDiv = container.querySelector(".fact-callout") as HTMLElement;
    expect(calloutDiv).toBeDefined();
    expect(calloutDiv.style.opacity).toBe("0");
  });

  it("applies partial opacity during fade in/out", () => {
    const { container } = render(<FactCallout fact={mockFact} parentZoom={0.65} />);
    const calloutDiv = container.querySelector(".fact-callout") as HTMLElement;
    expect(calloutDiv).toBeDefined();
    const opacity = parseFloat(calloutDiv.style.opacity);
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
  });
});
