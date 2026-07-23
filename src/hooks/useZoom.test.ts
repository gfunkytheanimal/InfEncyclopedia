import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZoom, ZOOM_THRESHOLD, INVERSE_THRESHOLD } from './useZoom';
import type { ThemeNode } from '../types';

describe('useZoom', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const createMockNode = (id: string, child?: ThemeNode): ThemeNode => ({
    id,
    title: `Title ${id}`,
    motifs: [],
    particles: { type: 'none', density: 0 },
    facts: [],
    child,
  });

  it('initializes correctly', () => {
    const root = createMockNode('root');
    const { result } = renderHook(() => useZoom(root));

    expect(result.current.zoom).toBe(1.0);
    expect(result.current.depth).toBe(0);
    expect(result.current.activeNode).toEqual(root);
    expect(result.current.pathFromRoot).toEqual([root]);
    expect(result.current.maxDepth).toBe(0);
  });

  it('zooms in and out correctly, updating depth', () => {
    const childNode = createMockNode('child');
    const root = createMockNode('root', childNode);
    const { result } = renderHook(() => useZoom(root));

    expect(result.current.maxDepth).toBe(1);

    act(() => {
      result.current.controls.zoomBy(10.0);
    });

    act(() => {
      // Wait long enough for lerp
      vi.advanceTimersByTime(16 * 50);
    });

    expect(result.current.depth).toBe(1);
    expect(result.current.activeNode).toEqual(childNode);
    expect(result.current.pathFromRoot).toEqual([root, childNode]);

    act(() => {
      result.current.controls.zoomBy(0.01);
    });

    act(() => {
      // Wait long enough for lerp
      vi.advanceTimersByTime(16 * 100);
    });

    expect(result.current.depth).toBe(0);
    expect(result.current.activeNode).toEqual(root);
  });

  it('clamps at max depth', () => {
    const root = createMockNode('root');
    const { result } = renderHook(() => useZoom(root));

    act(() => {
      result.current.controls.zoomBy(100.0);
    });

    act(() => {
      vi.advanceTimersByTime(16 * 200); // Need more ticks because it spikes and comes back
    });

    expect(result.current.depth).toBe(0);
    // It should eventually settle at ZOOM_THRESHOLD
    expect(result.current.zoom).toBeLessThanOrEqual(ZOOM_THRESHOLD + 0.001);
    expect(result.current.zoom).toBeGreaterThan(5.9);
  });

  it('clamps at min depth', () => {
    const root = createMockNode('root');
    const { result } = renderHook(() => useZoom(root));

    act(() => {
      result.current.controls.zoomBy(0.01);
    });

    act(() => {
      vi.advanceTimersByTime(16 * 200);
    });

    expect(result.current.depth).toBe(0);
    expect(result.current.zoom).toBeGreaterThanOrEqual(INVERSE_THRESHOLD - 0.001);
    expect(result.current.zoom).toBeLessThan(INVERSE_THRESHOLD + 0.1);
  });

  it('resets correctly', () => {
    const childNode = createMockNode('child');
    const root = createMockNode('root', childNode);
    const { result } = renderHook(() => useZoom(root));

    act(() => {
      result.current.controls.zoomBy(10.0);
    });

    act(() => {
      vi.advanceTimersByTime(16 * 50);
    });

    expect(result.current.depth).toBe(1);

    act(() => {
      result.current.controls.reset();
    });

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.depth).toBe(0);
    expect(result.current.activeNode).toEqual(root);
    expect(result.current.pathFromRoot).toEqual([root]);
    expect(result.current.zoom).toBe(1.0);
  });
});
