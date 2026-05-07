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

export interface ParticleSpec {
  type: ParticleType;
  density: number;
}

export interface ThemeNode {
  id: string;
  title: string;
  artRef?: string;
  motifs: string[];
  particles: ParticleSpec;
  facts: Fact[];
  child?: ThemeNode;
}
