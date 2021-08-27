const C_WIDTH: number = 300;
const C_HEIGHT: number = 200;

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = (() => {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Tried to access 2d canvas rendering context, but unlucky.");
  }

  return ctx;
})();

canvas.width = C_WIDTH;
canvas.height = C_HEIGHT;
canvas.style.border = "1px solid black";

document.body.appendChild(canvas);

let prevTimestamp: number = 0;
let r = {
  x: 50,
  y: 50,
  w: 50,
  h: 100
};

let a = 1;

function gameLoop(timestamp: number) {
  const dt: number = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

  const xw = r.x + r.w / 2;
  const yh = r.y + r.h / 2;

  ctx.translate(xw, yh);
  ctx.scale(a, 1);
  ctx.translate(-xw, -yh);
  ctx.fillStyle = a > 0 ? "black" : "red";
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  if (a > -1) {
    a -= 0.5 / dt;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

canvas.addEventListener("click", () => {
  a = 1;
});
