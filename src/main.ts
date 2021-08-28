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
  scaleX: number;
  w: number;
  h: number;
  isFlipped: boolean;
  flipSpeed: number;
}

function cardCreate(x: number, y: number): Card {
  const pos = vec2Create(x, y);
  const w = 2 * TILE;
  const h = 3 * TILE;
  const center = vec2Create(x + w / 2, y + h / 2);

  return {
    pos,
    center,
    scaleX: 1,
    w, h,
    isFlipped: false,
    flipSpeed: 0
  };
}

function cardDraw(c: Card, ctx: CanvasRenderingContext2D) {
  ctx.translate(c.center.x, c.center.y);
  ctx.scale(c.scaleX, 1);
  ctx.translate(-c.center.x, -c.center.y);
  ctx.fillStyle = c.scaleX > 0 ? "black" : "red";
  ctx.fillRect(c.pos.x, c.pos.y, c.w, c.h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function cardUpdate(c: Card, dt: number) {
  c.scaleX = Number((c.scaleX + (c.flipSpeed * dt)).toFixed(1));

  if (c.scaleX <= -1 || c.scaleX >= 1) {
    c.flipSpeed = 0;
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
    for (let x = TILE; x < C_WIDTH; x += TILE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, C_HEIGHT);
      ctx.stroke();
    }

    for (let y = TILE; y < C_HEIGHT; y += TILE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(C_WIDTH, y);
      ctx.stroke();
    }
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


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
      if (c.isFlipped) {
        c.flipSpeed = window.flipSpeed;
      } else {
        c.flipSpeed = -window.flipSpeed;
      }

      c.isFlipped = !c.isFlipped;

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
