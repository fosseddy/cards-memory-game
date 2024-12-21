import { mouse, state, canvas, assert } from "./game.mjs";
let unflipDelay = window.delayTime;
export function handleGameInput() {
    if (!mouse.isClicked || state.selected.length >= 2)
        return;
    for (const c of state.cards) {
        if (mouse.isInsideRect(c) && !state.selected.includes(c)) {
            flip(c);
            state.selected.push(c);
            break;
        }
    }
}
export function updateGame(dt) {
    updateCursor();
    updateSelected(dt);
    for (const c of state.cards)
        c.update(dt);
    if (state.cards.length == 0 || state.lives == 0)
        state.view = 2;
}
export function drawGame() {
    for (const c of state.cards)
        c.draw();
}
function updateCursor() {
    canvas.style.cursor = "default";
    if (state.selected.length >= 2)
        return;
    for (const c of state.cards) {
        if (c.isOpen)
            continue;
        if (mouse.isInsideRect(c)) {
            canvas.style.cursor = "pointer";
            return;
        }
    }
}
function updateSelected(dt) {
    if (state.selected.length < 2)
        return;
    const c1 = state.selected[0];
    const c2 = state.selected[1];
    if (c1.isAnimating || c2.isAnimating)
        return;
    if (c1.color.front.isEqual(c2.color.front)) {
        if (c1.isFaded) {
            assert(c2.isFaded);
            state.cards = state.cards.filter(c => !state.selected.includes(c));
            state.selected = [];
        }
        else {
            fadeout(c1, c2);
        }
    }
    else {
        if (unflipDelay <= 0) {
            if (c1.isClosed) {
                assert(c2.isClosed);
                state.lives--;
                state.selected = [];
                unflipDelay = window.delayTime;
            }
            else {
                flip(c1, c2);
            }
        }
        else {
            unflipDelay -= dt;
        }
    }
}
function fadeout(...cx) {
    for (const c of cx)
        c.dalpha = -1;
}
function flip(...cx) {
    for (const c of cx)
        c.dscale = -1;
}
//# sourceMappingURL=game-view.mjs.map