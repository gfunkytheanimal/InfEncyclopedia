export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

export interface ThemePalette {
  bg: string;
  accent: string;
  ink: string;
}

export function paletteForId(id: string): ThemePalette {
  const h = hashString(id);
  const hue = h % 360;
  const sat = 30 + ((h >>> 8) % 30);
  const lit = 14 + ((h >>> 16) % 10);
  return {
    bg: `hsl(${hue} ${sat}% ${lit}%)`,
    accent: `hsl(${(hue + 35) % 360} ${sat + 20}% ${lit + 35}%)`,
    ink: `hsl(${(hue + 200) % 360} ${sat - 10}% ${lit + 50}%)`,
  };
}
