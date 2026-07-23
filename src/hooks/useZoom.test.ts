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
  });
});
