import "./init.mjs";

import {assert, ctx, CANVAS_HEIGHT, CANVAS_WIDTH, TILE, state, mouse, View} from "./game.mjs";
import {handleGameInput, updateGame, drawGame} from "./game-view.mjs";
import {drawDone} from "./done-view.mjs";
import {drawMenu} from "./menu-view.mjs";

let prevtime = 0;
function gameLoop(time: number): void {
    const dt = (time - prevtime) / 1000;
    prevtime = time;

    // update
    if (state.view === View.Game) {
        handleGameInput();
        updateGame(dt);
    }

    // draw
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (window.isDrawGrid) {
        ctx.save();
        ctx.beginPath();
        for (let x = TILE; x < CANVAS_WIDTH; x += TILE) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
        }
        for (let y = TILE; y < CANVAS_HEIGHT; y += TILE) {
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
        }
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
        ctx.restore();
    }

    switch (state.view) {
    case View.Menu:
        drawMenu();
        break;
    case View.Game:
        drawGame();
        break;
    case View.Done:
        drawDone();
        break;
    default:
        assert(false, "Unreachable");
    }

     //cleanup
    mouse.reset();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
