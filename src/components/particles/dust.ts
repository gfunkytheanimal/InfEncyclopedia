import type { Particle } from "../../types";
import type { ParticleBehavior } from "./types";

export const dustBehavior: ParticleBehavior = {
  init: (p: Particle, _size: number, _initial: boolean) => {
    p.vx = (Math.random() - 0.5) * 0.3;
    p.vy = (Math.random() - 0.5) * 0.3;
    p.radius = 1 + Math.random() * 1.5;
  },
  updateAndDraw: (ctx: CanvasRenderingContext2D, p: Particle, size: number): boolean => {
    p.x += p.vx;
    p.y += p.vy;
    p.seed += 0.02;
    p.vx += Math.sin(p.seed) * 0.01;
    p.vy += Math.cos(p.seed) * 0.01;

    if (p.x < -20 || p.x > size + 20 || p.y < -20 || p.y > size + 20) {
      return true;
    }

    const alpha = 0.3 + Math.sin(p.seed) * 0.3;
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgb(220, 220, 230)";
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    return false;
  }
};
