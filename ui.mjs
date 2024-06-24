import { ctx, TILE, mouse, canvas } from "./game.mjs";
import { Vec2 } from "./math.mjs";
function drawText(text, x, y, size, color, align, baseline = "alphabetic") {
    ctx.save();
    ctx.font = `${size}px arial`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
}
function drawButton(text, x, y, w, h) {
    const isHovered = mouse.isInsideRect({
        pos: new Vec2(x, y),
        size: new Vec2(w, h)
    });
    const isClicked = isHovered && mouse.isClicked;
    ctx.save();
    ctx.strokeRect(x, y, w, h);
    if (isHovered)
        ctx.fillRect(x, y, w, h);
    ctx.restore();
    drawText(text, x + w / 2, y + h / 2, 1.1 * TILE, isHovered ? "white" : "black", "center", "middle");
    canvas.style.cursor = isHovered ? "pointer" : "default";
    return isClicked;
}
export function drawTitle(title, x, y) {
    drawText(title, x, y, 2.5 * TILE, "black", "center");
}
export function drawPrimaryButton(text, x, y) {
    const w = 9 * TILE;
    const h = 3 * TILE;
    return drawButton(text, x - w / 2, y, w, h);
}
//# sourceMappingURL=ui.mjs.map