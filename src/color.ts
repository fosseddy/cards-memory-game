export type Color = {
  [key: string]: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

export function create(r: number, g: number, b: number, a: number = 1): Color {
  return { r, g, b, a };
}

export function toString(c: Color): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
}

export function areEquals(c1: Color, c2: Color): boolean {
  let acc = true;

  for (const k of Object.keys(c1)) {
    acc &&= c1[k] === c2[k];
    if (!acc) return false;
  }

  return true;
}
