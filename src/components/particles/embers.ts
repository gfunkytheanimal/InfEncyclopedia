import type { Particle } from "../../types";
import type { ParticleBehavior } from "./types";

export const embersBehavior: ParticleBehavior = {
  init: (p: Particle, size: number, initial: boolean) => {
    p.y = initial ? Math.random() * size : size + 20;
    p.vx = (Math.random() - 0.5) * 1.5;
    p.vy = -1.0 - Math.random() * 2.5;
    p.radius = 1 + Math.random() * 2.5;
    p.maxLife = 50 + Math.random() * 100;
  },
  updateAndDraw: (ctx: CanvasRenderingContext2D, p: Particle, size: number): boolean => {
    p.x += p.vx + Math.sin(p.seed + p.life * 0.1) * 0.8;
    p.y += p.vy;

    if (p.life > p.maxLife) {
      return true;
    }
    if (p.x < -20 || p.x > size + 20 || p.y < -20 || p.y > size + 20) {
      return true;
    }

    const alpha = Math.max(0, 1 - (p.life / p.maxLife));
    ctx.beginPath();
    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = "rgb(255, 120, 50)";
    ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    return false;
  }
};
