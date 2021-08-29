import { TILE, C_WIDTH, C_HEIGHT } from "./constants";
import { createAndAppendTo } from "./canvas";
import { getRelativeMouseCoords, clickedInside } from "./utils";
import * as card from "./card";
// import * as vec2 from "./vec2";

type Game = {
  cards: card.Card[],
}

// DEV VARIABLES
window.showGrid = false;
window.flipSpeed = 5;

const { canvas, ctx } = createAndAppendTo(document.body);

const game: Game = {
  cards: [
    card.create(2 * TILE, 2 * TILE),
    card.create(5 * TILE, 2 * TILE),
  ],
}

let prevTimestamp = 0;
function gameLoop(timestamp: number) {
  const dt = (timestamp - prevTimestamp) * 0.001;
  // Firefox bug? During click event firefox returns the same value as before,
  // so dt will be 0, which leads to bugs. Chromium and Safari work fine.
  if (dt <= 0) {
    requestAnimationFrame(gameLoop);
    return;
  }
  console.assert(dt > 0);
  prevTimestamp = timestamp;

  // UPDATE
  for (const c of game.cards) {
    card.update(c, dt);
  }

  // DRAW
  ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
  for (const c of game.cards) {
    card.draw(c, ctx);
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

canvas.addEventListener("click", (event: MouseEvent) => {
  const mouse = getRelativeMouseCoords(event);

  for (const c of game.cards) {
    if (!clickedInside(c, mouse)) continue;

    if (c.scale <= -1) {
      c.dscale = window.flipSpeed;
    } else {
      c.dscale = -window.flipSpeed;
    }
  }
});

document.addEventListener("keypress", (event: KeyboardEvent) => {
  switch (event.keyCode) {
    case 103: {
      window.showGrid = !window.showGrid;
    } break;

    default:
      return;
  }
});
