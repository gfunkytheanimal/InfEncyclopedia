import type { ThemeNode } from "../types";

interface Props {
  path: ThemeNode[];
}

export function Breadcrumb({ path }: Props) {
  return (
    <div className="breadcrumb">
      {path.map((n, i) => {
        const isCur = i === path.length - 1;
        return (
          <span key={`${i}-${n.id}`}>
            <span className={isCur ? "breadcrumb-cur" : "breadcrumb-prev"}>
              {n.title}
            </span>
            {!isCur && <span className="breadcrumb-sep">›</span>}
          </span>
        );
      })}
    </div>
  );
}
