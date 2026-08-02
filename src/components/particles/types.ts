import type { Particle } from "../../types";

export interface ParticleBehavior {
  init: (p: Particle, size: number, initial: boolean) => void;
  updateAndDraw: (ctx: CanvasRenderingContext2D, p: Particle, size: number) => boolean;
}
