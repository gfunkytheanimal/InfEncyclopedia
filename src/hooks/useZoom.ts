import { useEffect, useMemo, useRef, useState } from "react";
import type { ThemeNode } from "../types";

export const ZOOM_THRESHOLD = 6.0;
export const INVERSE_THRESHOLD = 1 / ZOOM_THRESHOLD;
// Hysteresis: trigger swap-deeper at exactly 6.0, but trigger swap-shallower
// only once we've crossed below 1/6.5 (~0.1538), tighter than the geometric
// boundary 1/6. The swap math (zoom_new = zoom_old * 6) keeps geometry
// continuous regardless of when we trigger, so this purely buys safety
// against float wobble re-entering the trigger band post-swap.
const SWAP_IN_THRESHOLD = ZOOM_THRESHOLD;
const SWAP_OUT_THRESHOLD = 1 / 6.5;
const LERP = 0.12;
const MIN_ZOOM = INVERSE_THRESHOLD;

export interface ZoomControls {
  zoomBy: (factor: number) => void;
  reset: () => void;
}

export interface ZoomState {
  zoom: number;
  depth: number;
  activeNode: ThemeNode;
  pathFromRoot: ThemeNode[];
  maxDepth: number;
  controls: ZoomControls;
}

function walkToDepth(root: ThemeNode, d: number): ThemeNode {
  let n: ThemeNode = root;
  for (let i = 0; i < d; i++) {
    if (!n.child) break;
    n = n.child;
  }
  return n;
}

function buildPath(root: ThemeNode, d: number): ThemeNode[] {
  const out: ThemeNode[] = [root];
  let n: ThemeNode = root;
  for (let i = 0; i < d; i++) {
    if (!n.child) break;
    n = n.child;
    out.push(n);
  }
  return out;
}

export function useZoom(root: ThemeNode): ZoomState {
  const [, setTick] = useState(0);
  const zoomRef = useRef(1.0);
  const targetRef = useRef(1.0);
  const depthRef = useRef(0);

  const maxDepth = useMemo(() => {
    let n: ThemeNode | undefined = root;
    let d = 0;
    while (n?.child) {
      n = n.child;
      d++;
    }
    return d;
  }, [root]);

  const maxDepthRef = useRef(maxDepth);
  maxDepthRef.current = maxDepth;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const cur = zoomRef.current;
      const tgt = targetRef.current;
      const next = cur + (tgt - cur) * LERP;
      zoomRef.current = next;

      if (next >= SWAP_IN_THRESHOLD && depthRef.current < maxDepthRef.current) {
        depthRef.current += 1;
        zoomRef.current = next / ZOOM_THRESHOLD;
        targetRef.current = targetRef.current / ZOOM_THRESHOLD;
      } else if (next <= SWAP_OUT_THRESHOLD && depthRef.current > 0) {
        depthRef.current -= 1;
        zoomRef.current = next * ZOOM_THRESHOLD;
        targetRef.current = targetRef.current * ZOOM_THRESHOLD;
      }

      if (depthRef.current === 0 && targetRef.current < MIN_ZOOM) {
        targetRef.current = MIN_ZOOM;
      }
      if (depthRef.current === maxDepthRef.current && targetRef.current > ZOOM_THRESHOLD) {
        targetRef.current = ZOOM_THRESHOLD;
      }

      if (Math.abs(zoomRef.current - targetRef.current) > 0.001) {
        setTick((t) => (t + 1) | 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const controlsRef = useRef<ZoomControls | null>(null);
  if (!controlsRef.current) {
    controlsRef.current = {
      zoomBy: (factor: number) => {
        targetRef.current *= factor;
      },
      reset: () => {
        depthRef.current = 0;
        zoomRef.current = 1.0;
        targetRef.current = 1.0;
      },
    };
  }

  const depth = depthRef.current;

  const { activeNode, pathFromRoot } = useMemo(() => {
    return {
      activeNode: walkToDepth(root, depth),
      pathFromRoot: buildPath(root, depth),
    };
  }, [root, depth]);

  return {
    zoom: zoomRef.current,
    depth,
    activeNode,
    pathFromRoot,
    maxDepth,
    controls: controlsRef.current!,
  };
}
