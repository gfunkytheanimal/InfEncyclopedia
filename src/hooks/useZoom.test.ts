import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useZoom, ZOOM_THRESHOLD, INVERSE_THRESHOLD } from './useZoom';
import type { ThemeNode } from '../types';

const LERP = 0.12;

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
    const SWAP_OUT_THRESHOLD = 1 / 6.5;
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

  it('registers interaction', () => {
    const { result } = renderHook(() => useZoom(rootNode));

    // We can't directly read interactedAtRef, but we can verify the function exists and doesn't throw
    expect(() => {
      result.current.controls.registerInteraction();
    }).not.toThrow();
  });
});
