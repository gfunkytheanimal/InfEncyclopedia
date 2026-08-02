import { renderHook, act } from '@testing-library/react';
import { useZoom } from './useZoom';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { ThemeNode } from '../types';

describe('useZoom Performance', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: any) => setTimeout(cb, 16));
    vi.stubGlobal('cancelAnimationFrame', (id: any) => clearTimeout(id));
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('measures render count with continuous state updates', () => {
    let renderCount = 0;
    const mockNode: ThemeNode = {
      id: '1',
      title: '1',
      motifs: [],
      particles: { type: 'none', density: 0 },
      facts: [],
      child: undefined
    };

    renderHook(() => {
      renderCount++;
      return useZoom(mockNode);
    });

    act(() => {
      // Simulate 60 frames (1 second at 60fps)
      for(let i = 0; i < 60; i++) {
        vi.advanceTimersByTime(16);
      }
    });

    expect(renderCount).toBe(1);
    console.log(`Render count over 60 frames (Idle): ${renderCount}`);
  });
});
