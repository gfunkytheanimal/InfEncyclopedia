import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Extract the hook logic exactly as it is in App.tsx for benchmarking
const useFrameSize = () => {
    const [size, setSize] = React.useState(() =>
        typeof window === "undefined"
        ? 800
        : Math.min(window.innerWidth, window.innerHeight),
    );
    React.useEffect(() => {
        let rafId: number | null = null;
        const onResize = () => {
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(() => {
                setSize(Math.min(window.innerWidth, window.innerHeight));
                rafId = null;
            });
        };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            if (rafId !== null) window.cancelAnimationFrame(rafId);
        };
    }, []);
    return size;
}

describe('useFrameSize Performance Benchmark', () => {
  it('measures resize performance', async () => {
    let callCount = 0;

    // We mock rAF to execute immediately for testing to avoid actual async wait issues
    // but we simulate its queueing behavior so it only runs once per synchronous block
    let queuedRaf: (() => void) | null = null;
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
        queuedRaf = cb;
        return 1; // rafId
    });
    vi.stubGlobal('cancelAnimationFrame', () => {
        queuedRaf = null;
    });

    const OriginalMathMin = Math.min;
    Math.min = vi.fn((a, b) => {
        callCount++;
        return OriginalMathMin(a, b);
    });

    const TestComponent = () => {
        const size = useFrameSize();
        return <div>{size}</div>;
    };

    render(<TestComponent />);

    const startCallCount = callCount;
    const startTime = performance.now();

    act(() => {
        for (let i = 0; i < 1000; i++) {
            window.innerWidth = 800 + i;
            window.innerHeight = 600 + i;
            window.dispatchEvent(new Event('resize'));
        }
        // Run the queued rAF callback once at the end of the frame
        if (queuedRaf) {
            (queuedRaf as () => void)();
            queuedRaf = null;
        }
    });

    const endTime = performance.now();

    console.log(`Optimized - Math.min (resize calculation) calls after 1000 resizes: ${callCount - startCallCount}`);
    console.log(`Optimized - Time taken: ${endTime - startTime}ms`);

    // Expecting 1 calculation for 1000 events since it is throttled
    expect(callCount - startCallCount).toBe(1);

    Math.min = OriginalMathMin; // restore
    vi.unstubAllGlobals();
  });
});
