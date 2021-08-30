import { C_WIDTH, C_HEIGHT } from "./constants";

type CanvasData = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export function createAndAppendTo(el: HTMLElement): CanvasData {
  const canvas = document.createElement("canvas");
  const ctx: CanvasRenderingContext2D = (() => {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Tried to access 2d canvas rendering context," +
                      " but unlucky.");
    }

    return ctx;
  })();

  canvas.width = C_WIDTH;
  canvas.height = C_HEIGHT;
  canvas.style.border = "1px solid black";

  el.appendChild(canvas);

  return { canvas, ctx };
}
