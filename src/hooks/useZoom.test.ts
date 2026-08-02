import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from "vitest";
import { useZoom, ZOOM_THRESHOLD } from "./useZoom";
import type { ThemeNode } from "../types";

// Mock tree setup (depth = 2)
const mockNodeLevel2: ThemeNode = {
  id: "level2",
  title: "Level 2",
  motifs: [],
  particles: { type: "none", density: 0 },
  facts: [],
};

const mockNodeLevel1: ThemeNode = {
  id: "level1",
  title: "Level 1",
  motifs: [],
  particles: { type: "none", density: 0 },
  facts: [],
  child: mockNodeLevel2,
};

const mockRootNode: ThemeNode = {
  id: "root",
  title: "Root",
  motifs: [],
  particles: { type: "none", density: 0 },
  facts: [],
  child: mockNodeLevel1,
};

describe("useZoom", () => {
  let requestAnimationFrameSpy: MockInstance;
  let cancelAnimationFrameSpy: MockInstance;
  let callbacks: FrameRequestCallback[] = [];
  let frameId = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    callbacks = [];
    frameId = 0;

    requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      callbacks.push(cb);
      return ++frameId;
    });

    cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {
      // Stub
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    requestAnimationFrameSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
  });

  const triggerAnimationFrame = () => {
    const currentCallbacks = [...callbacks];
    callbacks = [];
    currentCallbacks.forEach((cb) => cb(performance.now()));
  };

  const advanceFrames = (frames: number) => {
    for (let i = 0; i < frames; i++) {
      act(() => {
        triggerAnimationFrame();
      });
    }
  };

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useZoom(mockRootNode));

    expect(result.current.zoom).toBe(1.0);
    expect(result.current.depth).toBe(0);
    expect(result.current.maxDepth).toBe(2);
    expect(result.current.activeNode).toBe(mockRootNode);
    expect(result.current.pathFromRoot).toEqual([mockRootNode]);
    expect(result.current.controls).toBeDefined();
  });

  it("should lerp zoom smoothly when zoomBy is called", () => {
    const { result } = renderHook(() => useZoom(mockRootNode));

    act(() => {
      result.current.controls.zoomBy(2.0);
    });

    // Before frame, zoom is still 1.0
    expect(result.current.zoom).toBe(1.0);

    // After 1 frame, lerp 12% towards 2.0 -> 1.12
    advanceFrames(1);
    expect(result.current.zoom).toBeCloseTo(1.12);

    // After many frames, should be very close to 2.0
    advanceFrames(50);
    expect(result.current.zoom).toBeCloseTo(2.0, 2);
  });

  it("should swap deeper when zoomed in past SWAP_IN_THRESHOLD", () => {
    const { result } = renderHook(() => useZoom(mockRootNode));

    act(() => {
      result.current.controls.zoomBy(7.0); // > 6.0
    });

    advanceFrames(100);

    // Swap should have occurred
    expect(result.current.depth).toBe(1);
    expect(result.current.activeNode).toBe(mockNodeLevel1);
    expect(result.current.pathFromRoot).toEqual([mockRootNode, mockNodeLevel1]);

    // Zoom should be divided by ZOOM_THRESHOLD
    // Target was 7.0, new target is 7.0 / 6.0 = 1.166...
    expect(result.current.zoom).toBeCloseTo(7.0 / ZOOM_THRESHOLD, 2);
  });

  it("should swap shallower when zoomed out past SWAP_OUT_THRESHOLD", () => {
    const { result } = renderHook(() => useZoom(mockRootNode));

    // First go deep
    act(() => {
      result.current.controls.zoomBy(6.5);
    });
    advanceFrames(100);
    expect(result.current.depth).toBe(1);

    // Now zoom out past 1/6.5 (~0.1538)
    act(() => {
      result.current.controls.zoomBy(0.1); // This will make target ~0.108
    });
    advanceFrames(100);

    expect(result.current.depth).toBe(0);
    expect(result.current.activeNode).toBe(mockRootNode);

    // Zoom should be multiplied by ZOOM_THRESHOLD
    // The previous target was ~1.083. zoomBy(0.1) -> 0.1083. Multiplied by 6 -> 0.65
    expect(result.current.zoom).toBeCloseTo((6.5 / ZOOM_THRESHOLD * 0.1) * ZOOM_THRESHOLD, 2);
  });

  it("should clamp zoom out (MIN_ZOOM) when at root depth", () => {
    const { result } = renderHook(() => useZoom(mockRootNode));
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useZoom, ZOOM_THRESHOLD, INVERSE_THRESHOLD } from './useZoom';
import type { ThemeNode } from '../types';

describe('useZoom', () => {
  const rootNode: ThemeNode = {
    id: 'root',
    title: 'Root',
    motifs: [],
    particles: { type: 'none', density: 0 },
    facts: [],
    child: {
      id: 'child1',
      title: 'Child 1',
      motifs: [],
      particles: { type: 'none', density: 0 },
      facts: [],
      child: {
        id: 'child2',
        title: 'Child 2',
        motifs: [],
        particles: { type: 'none', density: 0 },
        facts: [],
      }
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const runFrames = (frames: number) => {
    act(() => {
      for (let i = 0; i < frames; i++) {
        vi.advanceTimersByTime(16);
      }
    });
  };

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useZoom(rootNode));

    expect(result.current.zoom).toBe(1.0);
    expect(result.current.depth).toBe(0);
    expect(result.current.activeNode).toBe(rootNode);
    expect(result.current.pathFromRoot).toEqual([rootNode]);
    expect(result.current.maxDepth).toBe(2);
    expect(result.current.controls).toBeDefined();
  });

  it('zooms in and increases depth when crossing SWAP_IN_THRESHOLD', () => {
    const { result } = renderHook(() => useZoom(rootNode));

    act(() => {
      result.current.controls.zoomBy(ZOOM_THRESHOLD);
    });

    // Run enough frames for lerp to approach target
    // We just need it to cross SWAP_IN_THRESHOLD (6.0)
    // 1 + (6 - 1) * LERP...
    // actually, zoomBy multiplies targetRef by factor.
    // targetRef becomes 6.0.
    // However, it triggers swap when next >= SWAP_IN_THRESHOLD.
    // If target is exactly 6.0, it will eventually get very close to 6.0 but might not hit it exactly due to float precision or lerp never quite reaching target exactly if not rounded.
    // Let's zoomBy a bit more to ensure it crosses 6.0
    act(() => {
      result.current.controls.zoomBy(1.5); // target is now 9.0
    });

    runFrames(20);

    expect(result.current.depth).toBe(1);
    expect(result.current.activeNode.id).toBe('child1');
    expect(result.current.pathFromRoot.length).toBe(2);
    expect(result.current.pathFromRoot[1].id).toBe('child1');

    // Zoom should be scaled down by ZOOM_THRESHOLD
    // Since target was 9.0, zoom was approaching 9.0, crossed 6.0, then divided by 6.0.
    // target was also divided by 6.0 (became 1.5).
    expect(result.current.zoom).toBeLessThan(ZOOM_THRESHOLD);
  });

  it('zooms out and decreases depth when crossing SWAP_OUT_THRESHOLD', () => {
    const { result } = renderHook(() => useZoom(rootNode));

    // First zoom in
    act(() => {
      result.current.controls.zoomBy(10);
    });
    runFrames(20);

    expect(result.current.depth).toBe(1);

    // Now zoom out
    act(() => {
      // Current target is 10 / 6 = 1.666...
      // We want target to be less than SWAP_OUT_THRESHOLD
      result.current.controls.zoomBy(0.01);
    });

    runFrames(20);

    expect(result.current.depth).toBe(0);
    expect(result.current.activeNode.id).toBe('root');
  });

  it('resets to initial state', () => {
    const { result } = renderHook(() => useZoom(rootNode));

    act(() => {
      result.current.controls.zoomBy(10);
    });
    runFrames(20);
    expect(result.current.depth).toBe(1);

    act(() => {
      result.current.controls.reset();
    });
    runFrames(20);

    expect(result.current.depth).toBe(0);
    // target becomes 1.0, zoom approaches 1.0
    expect(result.current.zoom).toBeCloseTo(1.0, 1);
  });

  it('clamps zoom out at depth 0', () => {
    const { result } = renderHook(() => useZoom(rootNode));

    act(() => {
      result.current.controls.zoomBy(0.01);
    });

    advanceFrames(50);

    expect(result.current.depth).toBe(0);
    // MIN_ZOOM is 1 / ZOOM_THRESHOLD = 1/6
    expect(result.current.zoom).toBeCloseTo(1 / ZOOM_THRESHOLD, 2);
  });

  it("should clamp zoom in (ZOOM_THRESHOLD) when at maxDepth", () => {
    const { result } = renderHook(() => useZoom(mockRootNode));

    // Go to depth 1
    act(() => {
      result.current.controls.zoomBy(6.5);
    });
    advanceFrames(50);

    // Go to depth 2 (max depth)
    act(() => {
      result.current.controls.zoomBy(6.5);
    });
    advanceFrames(50);

    expect(result.current.depth).toBe(2);

    // Try to zoom in more
    act(() => {
      result.current.controls.zoomBy(10.0);
    });
    advanceFrames(100);

    // Should stay at depth 2 and zoom should clamp to ZOOM_THRESHOLD (6.0)
    expect(result.current.depth).toBe(2);
    expect(result.current.zoom).toBeCloseTo(ZOOM_THRESHOLD, 2);
  });

  it("should reset correctly", () => {
    const { result } = renderHook(() => useZoom(mockRootNode));

    // Go deep and zoom
    act(() => {
      result.current.controls.zoomBy(6.5);
    });
    advanceFrames(50);
    expect(result.current.depth).toBe(1);

    act(() => {
      result.current.controls.reset();
    });
    advanceFrames(1);

    expect(result.current.depth).toBe(0);

    // Lerps back towards 1.0 but target is immediately 1.0
    // Actually, reset sets zoomRef.current = 1.0 and targetRef.current = 1.0 immediately!
    expect(result.current.zoom).toBe(1.0);
    // Give it enough frames to fully lerp
    runFrames(50);

    // It should clamp targetRef to MIN_ZOOM (INVERSE_THRESHOLD)
    // and zoom will lerp to INVERSE_THRESHOLD
    expect(result.current.depth).toBe(0);
    expect(result.current.zoom).toBeCloseTo(INVERSE_THRESHOLD, 2);
  });

  it('clamps zoom in at maxDepth', () => {
    const { result } = renderHook(() => useZoom(rootNode));

    // Zoom in to maxDepth (2)
    act(() => {
      result.current.controls.zoomBy(100);
    });
    runFrames(40);

    expect(result.current.depth).toBe(2);

    // Try zooming in more
    act(() => {
      result.current.controls.zoomBy(10);
    });
    runFrames(20);

    // At maxDepth, targetRef is clamped to ZOOM_THRESHOLD
    expect(result.current.depth).toBe(2);
    expect(result.current.zoom).toBeCloseTo(ZOOM_THRESHOLD, 1);
  });
});
