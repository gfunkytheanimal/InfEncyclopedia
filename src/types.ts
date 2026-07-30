export type FactSlot =
  | "top-left"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";

export type ParticleType = "dust" | "bubbles" | "embers" | "snow" | "none";

export interface Fact {
  text: string;
  slot: FactSlot;
}

export interface Particle {
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

export interface ParticleSpec {
  type: ParticleType;
  density: number;
}

export interface ThemeNode {
  id: string;
  title: string;
  artRef?: string;
  splatSource?: string;
  motifs: string[];
  particles: ParticleSpec;
  facts: Fact[];
  child?: ThemeNode;
}
