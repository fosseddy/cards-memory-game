type ScalableShape = {
  scale: number;
  dscale: number;
}

type AlphaShape = {
  alpha: number;
  dalpha: number;
}

export function fadeOut(s: AlphaShape, speed: number) {
  s.dalpha = -speed;
}

export function isVisible(s: AlphaShape): boolean {
  return s.alpha > 0;
}

export function isFlipped(s: ScalableShape): boolean {
  return s.scale <= -1;
}

export function isFlipping(s: ScalableShape): boolean {
  return s.scale < 1 && s.scale > -1;
}

export function flip(s: ScalableShape, speed: number) {
  s.dscale = -speed;
}

export function unflip(s: ScalableShape, speed: number) {
  s.dscale = speed;
}
