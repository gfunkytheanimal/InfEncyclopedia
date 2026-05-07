import type { CSSProperties } from "react";
import type { Fact, FactSlot } from "../types";

const SLOT_STYLES: Record<FactSlot, CSSProperties> = {
  "top-left":     { top: "5%",    left: "5%" },
  "top":          { top: "5%",    left: "50%", transform: "translateX(-50%)" },
  "top-right":    { top: "5%",    right: "5%" },
  "right":        { top: "50%",   right: "5%", transform: "translateY(-50%)" },
  "bottom-right": { bottom: "5%", right: "5%" },
  "bottom":       { bottom: "5%", left: "50%", transform: "translateX(-50%)" },
  "bottom-left":  { bottom: "5%", left: "5%" },
  "left":         { top: "50%",   left: "5%", transform: "translateY(-50%)" },
};

function factOpacity(parentZoom: number): number {
  if (parentZoom < 0.45) return 0;
  if (parentZoom < 1.0) return (parentZoom - 0.45) / 0.55;
  if (parentZoom < 4.0) return 1;
  if (parentZoom < 6.0) return (6.0 - parentZoom) / 2.0;
  return 0;
}

interface Props {
  fact: Fact;
  parentZoom: number;
}

export function FactCallout({ fact, parentZoom }: Props) {
  const opacity = factOpacity(parentZoom);
  const slotStyle = SLOT_STYLES[fact.slot];
  return (
    <div
      className="fact-callout"
      style={{ ...slotStyle, opacity }}
      data-slot={fact.slot}
    >
      <span className="fact-text">{fact.text}</span>
    </div>
  );
}
