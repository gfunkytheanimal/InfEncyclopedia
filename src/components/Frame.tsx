import type { ThemeNode } from "../types";
import { SplatBackground } from "./SplatBackground";
import { FactCallout } from "./FactCallout";
import { ParticleLayer } from "./ParticleLayer";
import { BackgroundArt } from "./BackgroundArt";

const INNER_RATIO = 1 / 6;

interface Props {
  node: ThemeNode;
  scale: number;
  frameSize: number;
  depthRemaining: number;
  parentZoom: number;
}

export function Frame({
  node,
  scale,
  frameSize,
  depthRemaining,
  parentZoom,
}: Props) {
  return (
    <div
      className="frame"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        transform: `scale(${scale})`,
        transformOrigin: `${frameSize / 2}px ${frameSize / 2}px`,
      }}
    >
      <SplatBackground node={node} size={frameSize} />
      <BackgroundArt node={node} size={frameSize} />
      {node.particles && (
        <ParticleLayer
          spec={node.particles}
          size={frameSize}
          parentZoom={parentZoom}
        />
      )}
      <div className="frame-border" />
      <div className="facts-layer">
        {node.facts.map((fact, i) => (
          <FactCallout key={i} fact={fact} parentZoom={parentZoom} />
        ))}
      </div>
      {node.child && depthRemaining > 0 && (
        <Frame
          node={node.child}
          scale={INNER_RATIO}
          frameSize={frameSize}
          depthRemaining={depthRemaining - 1}
          parentZoom={parentZoom * INNER_RATIO}
        />
      )}
    </div>
  );
}
