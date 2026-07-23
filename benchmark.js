import { performance } from "perf_hooks";

class MockContext {
  beginPath() {}
  arc() {}
  fill() {}
  stroke() {}
  clearRect() {}
  get fillStyle() { return this._fillStyle; }
  set fillStyle(val) { this._fillStyle = val; }
  get globalAlpha() { return this._globalAlpha; }
  set globalAlpha(val) { this._globalAlpha = val; }
}

const ctx = new MockContext();

function testBaseline(count) {
  const start = performance.now();
  for (let i = 0; i < count; i++) {
    const alpha = (i % 100) / 100;
    ctx.fillStyle = `rgba(255, 120, 50, ${alpha})`;
  }
  const end = performance.now();
  return end - start;
}

function testOptimized(count) {
  const start = performance.now();
  for (let i = 0; i < count; i++) {
    const alpha = (i % 100) / 100;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgb(255, 120, 50)";
  }
  const end = performance.now();
  return end - start;
}

// Warmup
testBaseline(100000);
testOptimized(100000);

const runs = 10;
const iters = 1000000;

let baseTime = 0;
let optTime = 0;

for (let r=0; r<runs; r++) {
  baseTime += testBaseline(iters);
  optTime += testOptimized(iters);
}

console.log("Average Baseline:", baseTime / runs, "ms");
console.log("Average Optimized:", optTime / runs, "ms");
