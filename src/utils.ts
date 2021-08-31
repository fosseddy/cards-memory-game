import * as v2 from "./vec2";

type Shape = {
  pos: v2.Vec2;
  w: number;
  h: number;
}

export function toFixed(float: number, precision: number): number {
  return Number(float.toFixed(precision));
}

export function getRelativeMouseCoords(event: MouseEvent): v2.Vec2 {
  const { clientX, clientY, target } = event;
  const rect = (target as HTMLElement).getBoundingClientRect();

  return v2.create(clientX - rect.left, clientY - rect.top);
}


export function isInside(s: Shape, mouse: v2.Vec2): boolean {
  return mouse.x >= s.pos.x && mouse.x <= s.pos.x + s.w &&
         mouse.y >= s.pos.y && mouse.y <= s.pos.y + s.h;
}
