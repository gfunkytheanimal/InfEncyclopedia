import React, { useState } from "react";
import type { ThemeNode } from "../types";
import { PlaceholderArt } from "./PlaceholderArt";
import { Canvas, extend, Object3DNode } from "@react-three/fiber";
import { LumaSplatsThree, LumaSplatsSemantics } from "@lumaai/luma-web";

extend({ LumaSplats: LumaSplatsThree });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lumaSplats: Object3DNode<LumaSplatsThree, typeof LumaSplatsThree>;
  }
}

interface Props {
  node: ThemeNode;
  size: number;
}

const CANVAS_CAMERA = { position: [0, 0, 5] as [number, number, number], fov: 45 };
const CANVAS_STYLE = { width: '100%', height: '100%' };
const CANVAS_GL = { antialias: false };
const LUMA_POSITION = [0, 0, 0] as [number, number, number];

export function SplatBackground({ node, size }: Props) {
  const [imgOk, setImgOk] = useState(false);
  const splatSource = node.splatSource;

  return (
    <div className="frame-bg" style={FRAME_BG_STYLE}>
      <PlaceholderArt node={node} size={size} />

      {splatSource ? (
        <div style={SPLAT_CONTAINER_STYLE}>
          <Canvas
            camera={CANVAS_CAMERA}
            style={CANVAS_STYLE}
            gl={CANVAS_GL}
          >
            <ambientLight intensity={1} />
            <lumaSplats
              semanticsMask={LumaSplatsSemantics.FOREGROUND}
              source={splatSource}
              position={LUMA_POSITION}
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
