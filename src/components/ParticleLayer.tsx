import { useEffect, useRef } from "react";
import type { ParticleSpec, ParticleType, Particle } from "../types";
import { smoothstep } from "../utils/math";
import { particleBehaviors } from "./particles";

interface Props {
  spec: ParticleSpec;
  size: number;
  parentZoom: number;
}

function particleOpacity(parentZoom: number): number {
  // Fade in slightly so nested child particles aren't too prominent when small
  const fadeIn = smoothstep(0.1, 0.5, parentZoom);
  // Fade out as it approaches the maximum zoom threshold (6.0)
  const fadeOut = 1 - smoothstep(4.5, 5.8, parentZoom);
  return fadeIn * fadeOut;
}

function createParticles(spec: ParticleSpec, size: number): Particle[] {
  // Density roughly defines the number of particles. Multiplied by a factor for aesthetics.
  const count = spec.density * 5;
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push(spawnParticle(spec.type, size, true));
  }
  return particles;
}

function spawnParticle(type: ParticleType, size: number, initial: boolean): Particle {
  const p: Particle = {
    x: Math.random() * size,
    y: Math.random() * size,
    vx: 0,
    vy: 0,
    radius: 1,
    life: 0,
    maxLife: 100 + Math.random() * 200,
    alpha: Math.random(),
    type,
    seed: Math.random() * Math.PI * 2,
  };

  const behavior = particleBehaviors[type] || particleBehaviors.none;
  behavior.init(p, size, initial);

  if (initial) {
    p.life = Math.random() * p.maxLife;
  }

  return p;
}

function updateAndDraw(ctx: CanvasRenderingContext2D, particles: Particle[], size: number) {
  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life++;

    const behavior = particleBehaviors[p.type] || particleBehaviors.none;
    const respawn = behavior.updateAndDraw(ctx, p, size);

    if (respawn) {
      particles[i] = spawnParticle(p.type, size, false);
    }
  }
}

export function ParticleLayer({ spec, size, parentZoom }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create a ref for particles to persist across renders without re-running useEffect
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (spec.type === "none") return;

    // Only initialize particles once per spec/size
    particlesRef.current = createParticles(spec, size);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isActive = true;

    const render = () => {
      if (!isActive) return;
      updateAndDraw(ctx, particlesRef.current, size);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [spec, size]);

  if (spec.type === "none") return null;

  const opacity = particleOpacity(parentZoom);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        transition: "opacity 100ms linear",
      }}
    />
  );
}
