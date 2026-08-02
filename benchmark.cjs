const { performance } = require('perf_hooks');

const particles = [];
for (let i = 0; i < 10000; i++) {
  particles.push({
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: Math.random() * 5,
    life: Math.random() * 100,
    maxLife: 100,
    type: ["embers", "dust", "bubbles", "snow"][Math.floor(Math.random() * 4)],
    seed: Math.random() * Math.PI * 2,
    vx: 0,
    vy: 0
  });
}

// Mock ctx
const ctx = {
  beginPath: () => {},
  fill: () => {},
  stroke: () => {},
  arc: () => {},
  clearRect: () => {},
  set fillStyle(val) {},
  set strokeStyle(val) {},
  set lineWidth(val) {},
  set globalAlpha(val) {}
};

function updateAndDrawStrings(ctx, particles, size) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life++;

    // Draw
    ctx.beginPath();
    let alpha = 1;
    if (p.type === "embers") {
      alpha = Math.max(0, 1 - (p.life / p.maxLife));
      ctx.fillStyle = `rgba(255, 120, 50, ${alpha * 0.8})`;
      ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "dust") {
      alpha = 0.3 + Math.sin(p.seed) * 0.3;
      ctx.fillStyle = `rgba(220, 220, 230, ${alpha})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "bubbles") {
      ctx.strokeStyle = `rgba(200, 220, 255, 0.6)`;
      ctx.lineWidth = 1.5;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(200, 220, 255, 0.15)`;
      ctx.fill();
    } else if (p.type === "snow") {
      ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function updateAndDrawOpt(ctx, particles, size) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life++;

    // Draw
    ctx.beginPath();
    let alpha = 1;
    if (p.type === "embers") {
      alpha = Math.max(0, 1 - (p.life / p.maxLife));
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = "#ff7832";
      ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "dust") {
      alpha = 0.3 + Math.sin(p.seed) * 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#dcdce6";
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "bubbles") {
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = "#c8dcff";
      ctx.lineWidth = 1.5;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#c8dcff";
      ctx.fill();
    } else if (p.type === "snow") {
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#ffffff";
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const ITERATIONS = 1000;

const startString = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  updateAndDrawStrings(ctx, particles, 1000);
}
const endString = performance.now();
console.log(`String allocation: ${endString - startString}ms`);

const startOpt = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  updateAndDrawOpt(ctx, particles, 1000);
}
const endOpt = performance.now();
console.log(`Global alpha: ${endOpt - startOpt}ms`);
console.log(`Improvement: ${((endString - startString) - (endOpt - startOpt)) / (endString - startString) * 100}%`);
