import { useEffect, useState } from "react";
import { useZoom } from "./hooks/useZoom";
import { Frame } from "./components/Frame";
import { Breadcrumb } from "./components/Breadcrumb";
import themesJson from "./data/themes.json";
import type { ThemeNode } from "./types";

const root = themesJson as ThemeNode;

function useFrameSize(): number {
  const [size, setSize] = useState(() =>
    typeof window === "undefined"
      ? 800
      : Math.min(window.innerWidth, window.innerHeight),
  );
  useEffect(() => {
    let rafId: number | null = null;
    const onResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setSize(Math.min(window.innerWidth, window.innerHeight));
        rafId = null;
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);
  return size;
}

export default function App() {
  const { zoom, activeNode, pathFromRoot, controls } = useZoom(root);
  const frameSize = useFrameSize();

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      controls.zoomBy(factor);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [controls]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "+" || e.key === "=") {
        e.preventDefault();
        controls.zoomBy(1.18);
      } else if (e.key === "ArrowDown" || e.key === "-" || e.key === "_") {
        e.preventDefault();
        controls.zoomBy(1 / 1.18);
      } else if (e.key === "Escape") {
        controls.reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [controls]);

  return (
    <div className="viewport">
      <div
        className="stage"
        style={{ width: frameSize, height: frameSize }}
      >
        <Frame
          node={activeNode}
          scale={zoom}
          frameSize={frameSize}
          depthRemaining={2}
          parentZoom={zoom}
        />
      </div>
      <Breadcrumb path={pathFromRoot} />
      <div className="controls-hint">
        scroll · ↑ ↓ · esc to surface
      </div>
    </div>
  );
}
