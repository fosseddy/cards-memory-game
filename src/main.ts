import { TILE, C_WIDTH, C_HEIGHT } from "./constants";
import { createAndAppendTo } from "./canvas";
import { getRelativeMouseCoords, clickedInside } from "./utils";
import * as card from "./card";
import * as animate from "./animate";
import * as color from "./color";

// DEV VARIABLES
window.showGrid = false;
window.flipSpeed = 5;
window.fadeSpeed = 4;
window.unflipDelay = 100 * 0.001;

// GAME
type Game = {
  cards: card.Card[];
  flipped: card.Card[];
  unflipDelay: number;
}

const { canvas, ctx } = createAndAppendTo(document.body);

const game: Game = {
  cards: [
    card.create(2 * TILE, 2 * TILE, color.create(255, 0, 0)),
    card.create(5 * TILE, 2 * TILE, color.create(0, 0, 255)),
    card.create(8 * TILE, 2 * TILE, color.create(0, 255, 0)),
    card.create(11 * TILE, 2 * TILE, color.create(0, 255, 0)),
    card.create(14 * TILE, 2 * TILE, color.create(0, 0, 255)),
    card.create(17 * TILE, 2 * TILE, color.create(255, 0, 0)),
  ],
  flipped: [],
  unflipDelay: window.unflipDelay
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
    if (!game.flipped.includes(c) && animate.isFlipped(c)) {
      game.flipped.push(c);
    }
  }

  if (game.flipped.length >= 2) {
    const [c1, c2] = game.flipped;
    if (!c1 || !c2) throw new Error("Will this ever happen though?");

    if (color.areEquals(c1.color.front, c2.color.front)) {
      if (animate.isVisible(c1) && animate.isVisible(c2)) {
        animate.fadeOut(c1, window.fadeSpeed);
        animate.fadeOut(c2, window.fadeSpeed);
      } else {
        game.cards = game.cards.filter(c => !game.flipped.includes(c));
        game.flipped = [];
        game.unflipDelay = window.unflipDelay;
      }
    } else {
      if (game.unflipDelay <= 0) {
        game.unflipDelay = window.unflipDelay;
        game.flipped = [];

        for (const c of game.cards) {
          if (animate.isFlipped(c)) {
            animate.unflip(c, window.flipSpeed);
          }
        }
      } else {
        game.unflipDelay -= dt;
      }
    }
  }

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

  let flippedOrFlippingCount = 0;
  for (const c of game.cards) {
    if (animate.isFlipped(c) || animate.isFlipping(c)) {
      flippedOrFlippingCount += 1;
    }
  }

  for (const c of game.cards) {
    if (!clickedInside(c, mouse) ||
        animate.isFlipped(c) ||
        flippedOrFlippingCount >= 2) continue;

    animate.flip(c, window.flipSpeed);
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
