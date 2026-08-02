import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { FactCallout } from "./FactCallout";
import type { Fact } from "../types";

describe("FactCallout", () => {
  it("renders fact text", () => {
    const fact: Fact = { text: "Did you know?", slot: "top" };
    render(<FactCallout fact={fact} parentZoom={2} />);

    expect(screen.getByText("Did you know?")).toBeInTheDocument();
  });

  it("applies data-slot attribute to the container", () => {
    const fact: Fact = { text: "Some fact", slot: "bottom-right" };
    const { container } = render(<FactCallout fact={fact} parentZoom={2} />);

    const calloutDiv = container.querySelector(".fact-callout");
    expect(calloutDiv).toHaveAttribute("data-slot", "bottom-right");
  });

  it("applies slot-specific CSS styling", () => {
    const fact: Fact = { text: "Styling test", slot: "top-right" };
    const { container } = render(<FactCallout fact={fact} parentZoom={2} />);

    const calloutDiv = container.querySelector(".fact-callout") as HTMLElement;
    expect(calloutDiv.style.top).toBe("5%");
    expect(calloutDiv.style.right).toBe("5%");
  });

  describe("dynamic opacity behavior", () => {
    const fact: Fact = { text: "Opacity test", slot: "top" };

    it("is completely transparent when parentZoom <= 0.4", () => {
      const { container, rerender } = render(<FactCallout fact={fact} parentZoom={0.2} />);
      let div = container.querySelector(".fact-callout") as HTMLElement;
      expect(div.style.opacity).toBe("0");

      rerender(<FactCallout fact={fact} parentZoom={0.4} />);
      div = container.querySelector(".fact-callout") as HTMLElement;
      expect(div.style.opacity).toBe("0");
    });

    it("is fully opaque when 0.9 <= parentZoom <= 3.8", () => {
      const { container, rerender } = render(<FactCallout fact={fact} parentZoom={0.9} />);
      let div = container.querySelector(".fact-callout") as HTMLElement;
      expect(div.style.opacity).toBe("1");

      rerender(<FactCallout fact={fact} parentZoom={2.5} />);
      div = container.querySelector(".fact-callout") as HTMLElement;
      expect(div.style.opacity).toBe("1");

      rerender(<FactCallout fact={fact} parentZoom={3.8} />);
      div = container.querySelector(".fact-callout") as HTMLElement;
      expect(div.style.opacity).toBe("1");
    });

    it("is completely transparent when parentZoom >= 5.7", () => {
      const { container, rerender } = render(<FactCallout fact={fact} parentZoom={5.7} />);
      let div = container.querySelector(".fact-callout") as HTMLElement;
      expect(div.style.opacity).toBe("0");

      rerender(<FactCallout fact={fact} parentZoom={6.5} />);
      div = container.querySelector(".fact-callout") as HTMLElement;
      expect(div.style.opacity).toBe("0");
    });

    it("has intermediate opacity when transitioning (0.4 < parentZoom < 0.9)", () => {
      const { container } = render(<FactCallout fact={fact} parentZoom={0.65} />);
      const div = container.querySelector(".fact-callout") as HTMLElement;

      const opacity = parseFloat(div.style.opacity);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
      expect(opacity).toBeCloseTo(0.5, 2);
    });

    it("has intermediate opacity when transitioning (3.8 < parentZoom < 5.7)", () => {
      const { container } = render(<FactCallout fact={fact} parentZoom={4.75} />);
      const div = container.querySelector(".fact-callout") as HTMLElement;

      const opacity = parseFloat(div.style.opacity);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
      expect(opacity).toBeCloseTo(0.5, 2);
    });
  });
});
