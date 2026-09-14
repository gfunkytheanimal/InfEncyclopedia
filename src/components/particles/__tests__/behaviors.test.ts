import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dustBehavior } from '../dust';
import { bubblesBehavior } from '../bubbles';
import { embersBehavior } from '../embers';
import { snowBehavior } from '../snow';
import type { Particle } from '../../../types';

describe('Particle Behaviors', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockParticle: Particle;

  beforeEach(() => {
    mockCtx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    mockParticle = {
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      radius: 5,
      life: 0,
      maxLife: 100,
      alpha: 1,
      type: 'dust',
      seed: 0,
    };
  });

  describe('dustBehavior', () => {
    it('returns true when particle is out of bounds (x < -20)', () => {
      mockParticle.x = -21;
      expect(dustBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns true when particle is out of bounds (x > size + 20)', () => {
      mockParticle.x = 221;
      expect(dustBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns true when particle is out of bounds (y < -20)', () => {
      mockParticle.y = -21;
      expect(dustBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns true when particle is out of bounds (y > size + 20)', () => {
      mockParticle.y = 221;
      expect(dustBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns false when particle is within bounds', () => {
      expect(dustBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(false);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
    });
  });

  describe('bubblesBehavior', () => {
    it('returns true when particle is out of bounds', () => {
      mockParticle.y = -21;
      expect(bubblesBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns false when particle is within bounds', () => {
      expect(bubblesBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(false);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
      expect(mockCtx.stroke).toHaveBeenCalled();
    });
  });

  describe('embersBehavior', () => {
    it('returns true when particle life exceeds maxLife', () => {
      mockParticle.life = 101;
      expect(embersBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns true when particle is out of bounds', () => {
      mockParticle.y = -21;
      expect(embersBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns false when particle is within bounds and alive', () => {
      mockParticle.life = 50;
      expect(embersBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(false);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
    });
  });

  describe('snowBehavior', () => {
    it('returns true when particle is out of bounds', () => {
      mockParticle.y = 221;
      expect(snowBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(true);
    });

    it('returns false when particle is within bounds', () => {
      expect(snowBehavior.updateAndDraw(mockCtx, mockParticle, 200)).toBe(false);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
    });
  });
});
