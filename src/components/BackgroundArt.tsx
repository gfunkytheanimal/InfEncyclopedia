import { useState } from "react";
import type { ThemeNode } from "../types";
import { PlaceholderArt } from "./PlaceholderArt";

interface Props {
  node: ThemeNode;
  size: number;
}

export function BackgroundArt({ node, size }: Props) {
  const [imgOk, setImgOk] = useState(false);
  return (
    <div className="frame-bg">
      <PlaceholderArt node={node} size={size} />
      {node.artRef && (
        <img
          src={node.artRef}
          alt=""
          className="frame-bg-img"
          style={{ opacity: imgOk ? 1 : 0 }}
          onLoad={() => setImgOk(true)}
          onError={() => setImgOk(false)}
          draggable={false}
        />
      )}
    </div>
  );
}
