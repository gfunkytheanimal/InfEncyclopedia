import { useEffect, useRef } from "react";
import type { ParticleSpec, ParticleType } from "../types";

interface Props {
  spec: ParticleSpec;
  size: number;
  parentZoom: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  alpha: number;
  type: ParticleType;
  seed: number;
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
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

  if (type === "dust") {
    p.vx = (Math.random() - 0.5) * 0.3;
    p.vy = (Math.random() - 0.5) * 0.3;
    p.radius = 1 + Math.random() * 1.5;
  } else if (type === "bubbles") {
    p.y = initial ? Math.random() * size : size + 20;
    p.vy = -0.5 - Math.random() * 1.5;
    p.radius = 2 + Math.random() * 6;
  } else if (type === "embers") {
    p.y = initial ? Math.random() * size : size + 20;
    p.vx = (Math.random() - 0.5) * 1.5;
    p.vy = -1.0 - Math.random() * 2.5;
    p.radius = 1 + Math.random() * 2.5;
    p.maxLife = 50 + Math.random() * 100;
  } else if (type === "snow") {
    p.y = initial ? Math.random() * size : -20;
    p.vy = 0.5 + Math.random() * 1.5;
    p.radius = 1.5 + Math.random() * 2;
  }

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

    // Movement
    if (p.type === "dust") {
      p.x += p.vx;
      p.y += p.vy;
      p.seed += 0.02;
      p.vx += Math.sin(p.seed) * 0.01;
      p.vy += Math.cos(p.seed) * 0.01;
    } else if (p.type === "bubbles") {
      p.x += Math.sin(p.seed + p.life * 0.03) * 0.5;
      p.y += p.vy;
    } else if (p.type === "embers") {
      p.x += p.vx + Math.sin(p.seed + p.life * 0.1) * 0.8;
      p.y += p.vy;
    } else if (p.type === "snow") {
      p.x += Math.sin(p.seed + p.life * 0.02) * 1.0;
      p.y += p.vy;
    }

    // Wrap / Respawn
    let respawn = false;
    if (p.type === "embers" && p.life > p.maxLife) {
      respawn = true;
    }
    if (p.x < -20 || p.x > size + 20 || p.y < -20 || p.y > size + 20) {
      respawn = true;
    }

    if (respawn) {
      particles[i] = spawnParticle(p.type, size, false);
      continue;
    }

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
