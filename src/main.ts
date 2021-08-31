import { TILE, C_WIDTH, C_HEIGHT } from "./constants";
import { createAndAppendTo } from "./canvas";
import { getRelativeMouseCoords, isInside } from "./utils";
import * as card from "./card";
import * as ui from "./ui";
import * as color from "./color";

const colors: { [key: string]: [number, number, number] } = {
  "red": [255, 0, 0],
  "lime": [0, 255, 0],
  "blue": [0, 0, 255],
  "yellow": [255, 255, 0],
  "cyan": [0, 255, 255],
  "magenta": [255, 0, 255],
  "maroon": [128, 0, 0],
  "green": [0, 128, 0],
  "purple": [128, 0, 128],
  "teal": [0, 128, 128],
  "navy": [0, 0, 128],
  "wheat": [245, 222, 179],
}

// DEV VARIABLES
window.showGrid = false;
window.showCardFront = true;
window.flipSpeed = 5;
window.fadeOutSpeed = 4;
window.unflipDelay = 100 * 0.001;

// GAME
type Game = {
  cards: card.Card[];
  flippedCards: card.Card[];
  state: GameState;
  unflipDelay: number;
  menu: ui.UIElement[]
}

enum GameState {
  Menu = 0,
  Running,
  Paused,
  Finished
}

const { canvas, ctx } = createAndAppendTo(document.body);

const game: Game = {
  cards: fillCards(),
  flippedCards: [],
  state: GameState.Menu,
  unflipDelay: window.unflipDelay,
  menu: []
}

const menuHeader = ui.text("Card Memory Game", C_WIDTH / 2, TILE * 6);
menuHeader.font = "50px serif";
menuHeader.align = "center";

const startButton = ui.button("Start",
    C_WIDTH / 2 - ui.BUTTON_WIDTH / 2, TILE * 10);

game.menu.push(menuHeader);
game.menu.push(startButton);


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
  switch (game.state) {
    case GameState.Menu: {
    } break;

    case GameState.Running: {
      game.flippedCards = [];
      for (const c of game.cards) {
        if (c.scale <= -1) {
          game.flippedCards.push(c);
        }
      }

      if (game.flippedCards.length >= 2) {
        const [c1, c2] = game.flippedCards;
        if (!c1 || !c2) throw new Error("Will this ever happen though?");

        if (color.areEquals(c1.color.front, c2.color.front)) {
          if (c1.alpha > 0 || c2.alpha > 0) {
            c1.dalpha = c2.dalpha = -window.fadeOutSpeed;
          } else {
            game.cards = game.cards.filter(c => !game.flippedCards.includes(c));
            game.flippedCards = [];
          }
        } else {
          if (game.unflipDelay <= 0) {
            game.unflipDelay = window.unflipDelay;
            game.flippedCards = [];

            for (const c of game.cards) {
              if (c.scale <= -1) {
                c.dscale = window.flipSpeed;
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
    } break;

    default:
  }

  // DRAW
  ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

  switch (game.state) {
    case GameState.Menu: {
      for (const m of game.menu) {
        ui.draw(m, ctx);
      }
      resetStyle(ctx);
    } break;

    case GameState.Running: {
      for (const c of game.cards) {
        card.draw(c, ctx);
        resetStyle(ctx);
      }
    } break;

    default:
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

    resetStyle(ctx);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  const mouse = getRelativeMouseCoords(event);

  switch (game.state) {
    case GameState.Menu: {
      for (const m of game.menu) {
        if ("hovered" in m) {
          m.hovered = isInside(m, mouse);
        }
      }
    } break;

    default:
  }
});

canvas.addEventListener("click", (event: MouseEvent) => {
  const mouse = getRelativeMouseCoords(event);

  switch (game.state) {
    case GameState.Menu: {
      for (const m of game.menu) {
        if (!("w" in m) || !("h" in m)) continue;
        if (!isInside(m, mouse)) continue;
        game.state = GameState.Running;
      }
    } break;

    case GameState.Running: {
      let flippedOrFlippingCount = 0;
      for (const c of game.cards) {
        if (c.scale < 1) {
          flippedOrFlippingCount += 1;
        }
      }

      for (const c of game.cards) {
        if (!isInside(c, mouse) ||
            c.scale <= -1 ||
            flippedOrFlippingCount >= 2) continue;

        c.dscale = -window.flipSpeed;
      }
    } break;

    default:
  }
});

document.addEventListener("keypress", (event: KeyboardEvent) => {
  switch (event.code) {
    case 'KeyG': {
      window.showGrid = !window.showGrid;
    } break;

    case 'KeyF': {
      window.showCardFront = !window.showCardFront;
    } break;

    default:
      return;
  }
});

function shuffle<T>(arr: T[]): T[] {
  let newArr = [...arr];

  let ci = arr.length;
  let ri = 0;

  while (ci !== 0) {
    ri = Math.floor(Math.random() * ci);
    ci -= 1;

    [newArr[ci], newArr[ri]] = [newArr[ri]!, newArr[ci]!];
  }

  return newArr;
}

function fillCards(): card.Card[] {
  let cards: card.Card[] = [];
  let k = Object.keys(colors);
  let clrs = shuffle([...k, ...k]);

  let origx = 2;
  let x = origx;
  let y = 2;

  for (const c of clrs) {
    let xstep = 5;
    let ystep = 7;
    let col = color.create(...colors[c]!);

    cards.push(card.create(x * TILE, y * TILE, col));

    if (x >= 26) {
      x = origx;
      y += ystep;
    } else {
      x += xstep;
    }
  }

  return cards;
}

function resetStyle(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.font = "10px serif";
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}
