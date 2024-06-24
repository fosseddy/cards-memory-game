import { restart, CANVAS_HEIGHT, TILE, state, CANVAS_WIDTH } from "./game.mjs";
import { drawTitle, drawPrimaryButton } from "./ui.mjs";
export function drawDone() {
    let cursory = CANVAS_HEIGHT / 2 - 2 * TILE;
    const cx = CANVAS_WIDTH / 2;
    const title = state.lives > 0 ? "You are the Winner!" : "Game Over!";
    drawTitle(title, cx, cursory);
    cursory += 2 * TILE;
    const text = state.lives > 0 ? "Play again" : "Try again";
    if (drawPrimaryButton(text, cx, cursory))
        restart();
    cursory += 4 * TILE;
    if (drawPrimaryButton("Back to menu", cx, cursory)) {
        restart();
        state.view = 0;
    }
}
//# sourceMappingURL=done-view.mjs.map