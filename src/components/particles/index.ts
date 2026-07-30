import type { ParticleType } from "../../types";
import type { ParticleBehavior } from "./types";
import { dustBehavior } from "./dust";
import { bubblesBehavior } from "./bubbles";
import { embersBehavior } from "./embers";
import { snowBehavior } from "./snow";

// A dummy behavior for "none" so that we don't need undefined checks
// if "none" accidentally slips through to rendering.
const noneBehavior: ParticleBehavior = {
  init: () => {},
  updateAndDraw: () => true,
};

export const particleBehaviors: Record<ParticleType, ParticleBehavior> = {
  dust: dustBehavior,
  bubbles: bubblesBehavior,
  embers: embersBehavior,
  snow: snowBehavior,
  none: noneBehavior,
};
