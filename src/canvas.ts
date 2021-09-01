export class Canvas {
    static TILE = 20;
    static WIDTH = Canvas.TILE * 32;
    static HEIGHT = Canvas.TILE * 29;

    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(container: HTMLElement) {
        this.el = document.createElement("canvas");
        this.ctx = ((): CanvasRenderingContext2D => {
            const ctx = this.el.getContext("2d");

            if (!ctx) {
                throw new Error(
                    "Tried to access 2d canvas rendering context," +
                    " but unlucky.");
            }

            return ctx;
        })();

        this.el.width = Canvas.WIDTH;
        this.el.height = Canvas.HEIGHT;
        this.el.style.border = "1px solid black";

        container.appendChild(this.el);
    }
}
