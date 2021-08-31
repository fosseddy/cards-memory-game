import { TILE } from "./constants";
import { toFixed } from "./utils";
import * as vec2 from "./vec2";
import * as color from "./color";

type CardColor = {
  front: color.Color;
  back: color.Color;
}

export type Card = {
  pos: vec2.Vec2;
  center: vec2.Vec2;
  scale: number;
  dscale: number;
  w: number;
  h: number;
  color: CardColor;
  alpha: number;
  dalpha: number;
}

export function create(x: number, y: number, frontColor: color.Color): Card {
  const pos = vec2.create(x, y);
  const w = 3 * TILE;
  const h = 5 * TILE;
  const center = vec2.create(x + w / 2, y + h / 2);

  return {
    pos,
    center,
    scale: 1,
    dscale: 0,
    w, h,
    color: { back: color.create(0, 0, 0), front: frontColor },
    alpha: 1,
    dalpha: 0
  };
}

export function draw(c: Card, ctx: CanvasRenderingContext2D) {
  ctx.translate(c.center.x, c.center.y);
  ctx.scale(c.scale, 1);
  ctx.translate(-c.center.x, -c.center.y);

  if (window.showCardFront) {
    ctx.fillStyle = color.toString(c.color.front);
  } else {
    ctx.fillStyle = c.scale > 0
      ? color.toString(c.color.back)
      : color.toString(c.color.front);
  }

  ctx.fillRect(c.pos.x, c.pos.y, c.w, c.h);

  ctx.lineWidth = 2;
  ctx.strokeStyle = color.toString(c.color.back);
  ctx.strokeRect(c.pos.x, c.pos.y, c.w, c.h);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function update(c: Card, dt: number) {
  if (c.dscale === 0 && c.dalpha === 0) return;

  c.scale = toFixed(c.scale + c.dscale * dt, 1);
  if (c.scale <= -1 || c.scale >= 1) {
    c.dscale = 0;
  }

  c.alpha += c.dalpha * dt;
  if (c.alpha >= 1 || c.alpha <= 0) {
    c.dalpha = 0;
  }

  c.color.front.a = c.alpha;
  c.color.back.a = c.alpha;

  console.log(c);
}
