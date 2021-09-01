import { Canvas } from "./canvas";
import { getRelativeMouseCoords, isInside } from "./utils";
import { Card } from "./card";
import { Color } from "./color";
import * as ui from "./ui";

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
    cards: Card[];
    flippedCards: Card[];
    state: GameState;
    unflipDelay: number;
    menu: Array<ui.Text | ui.Button>
}

enum GameState {
    Menu = 0,
    Running,
    Paused,
    Finished
}

const canvas = new Canvas(document.body);

const game: Game = {
    cards: fillCards(),
    flippedCards: [],
    state: GameState.Menu,
    unflipDelay: window.unflipDelay,
    menu: []
}

const menuHeader = new ui.Text(
    "Card Memory Game",
    Canvas.WIDTH / 2,
    Canvas.TILE * 6);
menuHeader.font = "50px serif";
menuHeader.align = "center";

const startButton = new ui.Button(
    "Start",
    Canvas.WIDTH / 2 - ui.Button.WIDTH / 2,
    Canvas.TILE * 10);

startButton.onClick = () => {
    game.state = GameState.Running;
};

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
    const { ctx } = canvas;

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
            if (!c1 || !c2) {
                throw new Error("Will this ever happen though?");
            }

            if (c1.color.front.isEqualTo(c2.color.front)) {
                if (c1.alpha > 0 || c2.alpha > 0) {
                    c1.dalpha = c2.dalpha = -window.fadeOutSpeed;
                } else {
                    game.cards = game.cards.filter(
                        c => !game.flippedCards.includes(c));
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
            c.update(dt);
        }
    } break;

    default:
    }

    // DRAW
    ctx.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);

    switch (game.state) {
    case GameState.Menu: {
        for (const m of game.menu) {
            m.draw(ctx);
        }
        resetStyle(ctx);
    } break;

    case GameState.Running: {
        for (const c of game.cards) {
            c.draw(ctx);
            resetStyle(ctx);
        }
    } break;

    default:
    }

    if (window.showGrid) {
        ctx.beginPath();

        for (let x = Canvas.TILE; x < Canvas.WIDTH; x += Canvas.TILE) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Canvas.HEIGHT);
        }

        for (let y = Canvas.TILE; y < Canvas.HEIGHT; y += Canvas.TILE) {
            ctx.moveTo(0, y);
            ctx.lineTo(Canvas.WIDTH, y);
        }

        ctx.stroke();

        resetStyle(ctx);
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

canvas.el.addEventListener("mousemove", (event: MouseEvent) => {
    const mouse = getRelativeMouseCoords(event);

    switch (game.state) {
    case GameState.Menu: {
        for (const m of game.menu) {
            if (!(m instanceof ui.Button)) continue;

            if (isInside(m, mouse)) {
                m.hovered = true;
                canvas.el.style.cursor = "pointer";
            } else {
                m.hovered = false;
                canvas.el.style.cursor = "default";
            }
        }
    } break;

    default:
    }
});

canvas.el.addEventListener("click", (event: MouseEvent) => {
    const mouse = getRelativeMouseCoords(event);

    switch (game.state) {
    case GameState.Menu: {
        for (const m of game.menu) {
            if (!(m instanceof ui.Button)) continue;
            if (!isInside(m, mouse)) continue;

            m.onClick();
            canvas.el.style.cursor = "default";
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

function fillCards(): Card[] {
    let cards: Card[] = [];
    let k = Object.keys(colors);
    let clrs = shuffle([...k, ...k]);

    let origx = 2;
    let x = origx;
    let y = 2;

    for (const c of clrs) {
        let xstep = 5;
        let ystep = 7;
        let col = new Color(...colors[c]!);

        cards.push(new Card(x * Canvas.TILE, y * Canvas.TILE, col));

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
