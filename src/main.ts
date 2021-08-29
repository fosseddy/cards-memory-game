const TILE: number = 20;
const C_WIDTH: number = TILE * 30;
const C_HEIGHT: number = TILE * 20;

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = (() => {
  const ctx = canvas.getContext("2d");

    if (!ctx) {
    throw new Error("Tried to access 2d canvas rendering context, but unlucky.");
  }

  return ctx;
})();

canvas.width = C_WIDTH;
canvas.height = C_HEIGHT;
canvas.style.border = "1px solid black";
document.body.appendChild(canvas);

window.showGrid = false;
window.flipSpeed = 5;

// VEC2
type Vec2 = {
  x: number;
  y: number;
}

function vec2Create(x: number, y: number): Vec2 {
  return { x, y };
}

// CARD
type Card = {
  pos: Vec2;
  center: Vec2;
  scale: number;
  w: number;
  h: number;
  dscale: number;
}

function cardCreate(x: number, y: number): Card {
  const pos = vec2Create(x, y);
  const w = 2 * TILE;
  const h = 3 * TILE;
  const center = vec2Create(x + w / 2, y + h / 2);

  return {
    pos,
    center,
    scale: 1,
    dscale: 0,
    w, h
  };
}

function cardDraw(c: Card, ctx: CanvasRenderingContext2D) {
  ctx.translate(c.center.x, c.center.y);
  ctx.scale(c.scale, 1);
  ctx.translate(-c.center.x, -c.center.y);
  ctx.fillStyle = c.scale > 0 ? "black" : "red";
  ctx.fillRect(c.pos.x, c.pos.y, c.w, c.h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function cardUpdate(c: Card, dt: number) {
  c.scale = toFixed(c.scale + c.dscale * dt, 1);

  if (c.scale <= -1 || c.scale >= 1) {
    c.dscale = 0;
  }
}

// GAME
const cards: Card[] = [
  cardCreate(2 * TILE, 2 * TILE),
  cardCreate(5 * TILE, 2 * TILE),
];

let prevTimestamp: number = 0;

function gameLoop(timestamp: number) {
  const dt: number = (timestamp - prevTimestamp) * 0.001;
  // Firefox bug? During click event firefox returns the same value as before,
  // so dt will be 0, which leads to bugs. Chromium and Safari work fine.
  if (dt <= 0) {
    requestAnimationFrame(gameLoop);
    return;
  }
  console.assert(dt > 0);
  prevTimestamp = timestamp;

  // UPDATE
  for (const c of cards) {
    cardUpdate(c, dt);
  }

  // DRAW
  ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
  for (const c of cards) {
    cardDraw(c, ctx);
  }

  if (window.showGrid) {
    ctx.beginPath();

    for (let x = TILE; x < C_WIDTH; x += TILE) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, C_HEIGHT);
    }

    for (let y = TILE; y < C_HEIGHT; y += TILE) {
      ctx.moveTo(0, y);
      ctx.lineTo(C_WIDTH, y);
    }

    ctx.stroke();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

function toFixed(float: number, precision: number): number {
  return Number(float.toFixed(precision));
}

function getRelativeMouseCoords(event: MouseEvent): Vec2 {
  const { clientX, clientY, target } = event;
  const rect = (target as HTMLElement).getBoundingClientRect();

  return vec2Create(clientX - rect.left, clientY - rect.top);
}

function clickedInside(c: Card, mouse: Vec2): boolean {
  return mouse.x >= c.pos.x && mouse.x <= c.pos.x + c.w &&
         mouse.y >= c.pos.y && mouse.y <= c.pos.y + c.h;
}

canvas.addEventListener("click", (event: MouseEvent) => {
  const mouse = getRelativeMouseCoords(event);

  for (const c of cards) {
    if (clickedInside(c, mouse)) {
      if (c.scale <= -1) {
        c.dscale = window.flipSpeed;
      } else {
        c.dscale = -window.flipSpeed;
      }

      console.log(c);
    }
  }
});

window.addEventListener("keypress", (event: KeyboardEvent) => {
  switch (event.keyCode) {
    case 103: {
      window.showGrid = !window.showGrid;
    } break;

    default:
      return;
  }
});
