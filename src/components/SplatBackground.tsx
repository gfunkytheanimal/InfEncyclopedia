import { useState } from "react";
import type { ThemeNode } from "../types";
import { PlaceholderArt } from "./PlaceholderArt";
import { Canvas } from "@react-three/fiber";
import { LumaSplatsThree, LumaSplatsSemantics } from "@lumaai/luma-web";
import { extend } from "@react-three/fiber";

extend({ LumaSplats: LumaSplatsThree });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lumaSplats: any;
  }
}

interface Props {
  node: ThemeNode;
  size: number;
}

export function SplatBackground({ node, size }: Props) {
  const [imgOk, setImgOk] = useState(false);
  const splatSource = node.splatSource; // Assume we will add splatSource to ThemeNode

  return (
    <div className="frame-bg" style={{ pointerEvents: 'none' }}>
      <PlaceholderArt node={node} size={size} />

      {splatSource ? (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 1, filter: 'blur(2px) contrast(1.2) brightness(0.8)' }}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ antialias: false }}
          >
            <ambientLight intensity={1} />
            <lumaSplats
              semanticsMask={LumaSplatsSemantics.FOREGROUND}
              source={splatSource}
              position={[0, 0, 0]}
              scale={1}
            />
          </Canvas>
        </div>
      ) : node.artRef ? (
        <img
          src={node.artRef}
          alt=""
          className="frame-bg-img"
          style={{ opacity: imgOk ? 1 : 0 }}
          onLoad={() => setImgOk(true)}
          onError={() => setImgOk(false)}
          draggable={false}
        />
      ) : null}
    </div>
  );
}
