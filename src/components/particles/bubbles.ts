import type { Particle } from "../../types";
import type { ParticleBehavior } from "./types";

export const bubblesBehavior: ParticleBehavior = {
  init: (p: Particle, size: number, initial: boolean) => {
    p.y = initial ? Math.random() * size : size + 20;
    p.vy = -0.5 - Math.random() * 1.5;
    p.radius = 2 + Math.random() * 6;
  },
  updateAndDraw: (ctx: CanvasRenderingContext2D, p: Particle, size: number): boolean => {
    p.x += Math.sin(p.seed + p.life * 0.03) * 0.5;
    p.y += p.vy;

    if (p.x < -20 || p.x > size + 20 || p.y < -20 || p.y > size + 20) {
      return true;
    }

    ctx.beginPath();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = "rgb(200, 220, 255)";
    ctx.lineWidth = 1.5;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "rgb(200, 220, 255)";
    ctx.fill();
    ctx.globalAlpha = 1.0;

    return false;
  }
};
