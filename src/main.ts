import { TILE, C_WIDTH, C_HEIGHT } from "./constants";
import { createAndAppendTo } from "./canvas";
import { getRelativeMouseCoords, clickedInside } from "./utils";
import * as card from "./card";

type Game = {
  cards: card.Card[];
  flipped: card.Card[];
  correct: card.Card[];
  unflipDelay: number;
}

function gameGetAvailableCards(g: Game): card.Card[] {
  return g.cards.filter(c => !g.correct.includes(c));
}

// DEV VARIABLES
window.showGrid = false;
window.flipSpeed = 5;
window.unflipDelay = 100 * 0.001;

const { canvas, ctx } = createAndAppendTo(document.body);

const game: Game = {
  cards: [
    card.create(2 * TILE, 2 * TILE, "red"),
    card.create(5 * TILE, 2 * TILE, "blue"),
    card.create(8 * TILE, 2 * TILE, "green"),
    card.create(11 * TILE, 2 * TILE, "green"),
    card.create(14 * TILE, 2 * TILE, "blue"),
    card.create(17 * TILE, 2 * TILE, "red"),
  ],
  flipped: [],
  correct: [],
  unflipDelay: window.unflipDelay,
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
  const board = gameGetAvailableCards(game);

  for (const c of board) {
    card.update(c, dt);
  }

  for (const c of board) {
    if (!game.flipped.includes(c) && c.scale <= -1) {
      game.flipped.push(c);
    }
  }

  if (game.flipped.length >= 2) {
    const [c1, c2] = game.flipped;
    if (!c1 || !c2) throw new Error("WTF");

    if (c1.color.front === c2.color.front) {
      game.correct.push(c1, c2);
      game.flipped = [];
    } else {
      if (game.unflipDelay <= 0) {
        game.unflipDelay = window.unflipDelay;
        game.flipped = [];

        for (const c of board) {
          if (c.scale <= -1) {
            c.dscale = window.flipSpeed;
          }
        }
      } else {
        game.unflipDelay -= dt;
      }
    }
  }

  // DRAW
  ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

  for (const c of game.cards) {
    card.draw(c, ctx);
  }


  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.font = "40px serif";
  if (game.correct.length === game.cards.length) {
    ctx.fillText("You are the Winner!", C_WIDTH / 2, C_HEIGHT / 2 + 30);
  } else {
    ctx.fillText("flipped: " + String(game.flipped.length), C_WIDTH / 2, C_HEIGHT / 2 + 30);
    ctx.fillText("correct: " + String(game.correct.length), C_WIDTH / 2, C_HEIGHT / 2 + 80);
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

  let flippedOrFlippingCount = 0;
  for (const c of gameGetAvailableCards(game)) {
    if (c.scale < 1) flippedOrFlippingCount += 1;
  }

  for (const c of game.cards) {
    if (!clickedInside(c, mouse) ||
        c.scale < 1 ||
        flippedOrFlippingCount >= 2) continue;
    c.dscale = -window.flipSpeed;
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
