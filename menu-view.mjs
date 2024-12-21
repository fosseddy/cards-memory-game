import { CANVAS_HEIGHT, TILE, state, CANVAS_WIDTH } from "./game.mjs";
import { drawTitle, drawPrimaryButton } from "./ui.mjs";
export function drawMenu() {
    let cursory = CANVAS_HEIGHT / 2 - 2 * TILE;
    const cx = CANVAS_WIDTH / 2;
    drawTitle("Cards Memory Game", cx, cursory);
    cursory += 2 * TILE;
    if (drawPrimaryButton("Start", cx, cursory))
        state.view = 1;
}
//# sourceMappingURL=menu-view.mjs.map