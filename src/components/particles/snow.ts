import type { Particle } from "../../types";
import type { ParticleBehavior } from "./types";

export const snowBehavior: ParticleBehavior = {
  init: (p: Particle, size: number, initial: boolean) => {
    p.y = initial ? Math.random() * size : -20;
    p.vy = 0.5 + Math.random() * 1.5;
    p.radius = 1.5 + Math.random() * 2;
  },
  updateAndDraw: (ctx: CanvasRenderingContext2D, p: Particle, size: number): boolean => {
    p.x += Math.sin(p.seed + p.life * 0.02) * 1.0;
    p.y += p.vy;

    if (p.x < -20 || p.x > size + 20 || p.y < -20 || p.y > size + 20) {
      return true;
    }

    ctx.beginPath();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    return false;
  }
};
