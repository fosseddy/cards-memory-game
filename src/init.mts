window.isDrawGrid = true;
window.isDrawFront = false;
window.flipSpeed = 6.5;
window.fadeoutSpeed = 3.5;
window.delayTime = 0.15;

document.addEventListener("keypress", (e: KeyboardEvent) => {
    switch (e.code) {
    case "KeyG":
        window.isDrawGrid = !window.isDrawGrid;
        break;
    case "KeyF":
        window.isDrawFront = !window.isDrawFront;
        break;
    default:
        return;
    }
});
