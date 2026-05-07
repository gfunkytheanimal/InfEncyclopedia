import type { ThemeNode } from "../types";
import { paletteForId } from "../utils/placeholderArt";

interface Props {
  node: ThemeNode;
  size: number;
}

export function PlaceholderArt({ node, size }: Props) {
  const palette = paletteForId(node.id);
  const gid = `grad-${node.id}`;
  const vid = `vig-${node.id}`;
  return (
    <svg
      className="placeholder-art"
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={gid} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor={palette.accent} stopOpacity="0.55" />
          <stop offset="55%" stopColor={palette.bg} stopOpacity="1" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>
        <radialGradient id={vid} cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width={size} height={size} fill={`url(#${gid})`} />
      <g opacity="0.18" fill={palette.accent}>
        <circle cx={size * 0.18} cy={size * 0.22} r={size * 0.02} />
        <circle cx={size * 0.82} cy={size * 0.18} r={size * 0.014} />
        <circle cx={size * 0.74} cy={size * 0.78} r={size * 0.018} />
        <circle cx={size * 0.22} cy={size * 0.82} r={size * 0.012} />
        <circle cx={size * 0.5} cy={size * 0.12} r={size * 0.01} />
        <circle cx={size * 0.12} cy={size * 0.5} r={size * 0.01} />
        <circle cx={size * 0.88} cy={size * 0.5} r={size * 0.01} />
        <circle cx={size * 0.5} cy={size * 0.88} r={size * 0.01} />
      </g>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={palette.accent}
        opacity="0.55"
        fontFamily='"Iowan Old Style", Palatino, Georgia, serif'
        fontSize={size * 0.06}
        fontStyle="italic"
        letterSpacing={size * 0.004}
      >
        {node.title}
      </text>
      <rect width={size} height={size} fill={`url(#${vid})`} />
    </svg>
  );
}
