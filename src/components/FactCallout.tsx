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

export function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Plateau roughly centered in log space on [1/6, 6]: full from ~0.9 to ~3.8,
// smoothstep ramps at the edges so facts neither pop nor jitter near a swap.
function factOpacity(parentZoom: number): number {
  const fadeIn = smoothstep(0.4, 0.9, parentZoom);
  const fadeOut = 1 - smoothstep(3.8, 5.7, parentZoom);
  return fadeIn * fadeOut;
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
