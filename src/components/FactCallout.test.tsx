import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FactCallout } from "./FactCallout";
import type { Fact } from "../types";

describe("FactCallout", () => {
  const mockFact: Fact = {
    text: "Test fact text",
    slot: "top-left",
  };

  it("renders the fact text", () => {
    render(<FactCallout fact={mockFact} parentZoom={2} />);
    expect(screen.getByText("Test fact text")).toBeInTheDocument();
  });

  it("sets the correct data-slot attribute", () => {
    render(<FactCallout fact={mockFact} parentZoom={2} />);
    const callout = screen.getByText("Test fact text").parentElement;
    expect(callout).toHaveAttribute("data-slot", "top-left");
  });

  it("applies the correct slot styles", () => {
    render(<FactCallout fact={{ ...mockFact, slot: "top" }} parentZoom={2} />);
    const callout = screen.getByText("Test fact text").parentElement;
    expect(callout).toHaveStyle({ top: "5%", left: "50%", transform: "translateX(-50%)" });
  });

  describe("opacity calculation", () => {
    it("is completely transparent when zoom is very low", () => {
      render(<FactCallout fact={mockFact} parentZoom={0.3} />);
      const callout = screen.getByText("Test fact text").parentElement;
      expect(callout).toHaveStyle({ opacity: "0" });
    });

    it("fades in as zoom increases", () => {
      render(<FactCallout fact={mockFact} parentZoom={0.65} />);
      const callout = screen.getByText("Test fact text").parentElement;
      // 0.65 is halfway between 0.4 and 0.9, smoothstep(0.5) = 0.5
      expect(callout).toHaveStyle({ opacity: "0.5" });
    });

    it("is fully visible in the middle zoom range", () => {
      render(<FactCallout fact={mockFact} parentZoom={2} />);
      const callout = screen.getByText("Test fact text").parentElement;
      expect(callout).toHaveStyle({ opacity: "1" });
    });

    it("fades out as zoom gets too high", () => {
      render(<FactCallout fact={mockFact} parentZoom={4.75} />);
      const callout = screen.getByText("Test fact text").parentElement;
      // 4.75 is halfway between 3.8 and 5.7, fadeOut = 1 - smoothstep(0.5) = 0.5
      expect(callout).toHaveStyle({ opacity: "0.5" });
    });

    it("is completely transparent when zoom is very high", () => {
      render(<FactCallout fact={mockFact} parentZoom={6.0} />);
      const callout = screen.getByText("Test fact text").parentElement;
      expect(callout).toHaveStyle({ opacity: "0" });
    });
  });
});
