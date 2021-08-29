export type Vec2 = {
  x: number;
  y: number;
}

export function create(x: number, y: number): Vec2 {
  return { x, y };
}
