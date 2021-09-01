import { Canvas } from "./canvas";
import { Vec2 } from "./vec2";

//enum UIElementType {
//  Text = 0,
//  Button
//}

interface UIElementBase {
  pos: Vec2;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

interface UIElementText extends UIElementBase {
    text: string;
    font: string;
    align: CanvasTextAlign | "";
    baseline: CanvasTextBaseline | "";
}

interface UIElementButton extends UIElementBase {
    text: Text;
    w: number;
    h: number;
    hovered: boolean;
    onClick: () => void;
}

export class Text implements UIElementText {
    pos: Vec2;
    text: string;

    align: CanvasTextAlign | "" = "";
    baseline: CanvasTextBaseline | "" = "";
    font: string = "";

    constructor(text: string, x: number, y: number) {
        this.pos = new Vec2(x, y);
        this.text = text;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.align) ctx.textAlign = this.align;
        if (this.baseline) ctx.textBaseline = this.baseline;
        if (this.font) ctx.font = this.font;

        ctx.fillText(this.text, this.pos.x, this.pos.y);
    }
}

export class Button implements UIElementButton {
    static WIDTH = Canvas.TILE * 10;
    static HEIGHT = Canvas.TILE * 3;

    pos: Vec2;
    text: Text;

    w: number = Button.WIDTH;
    h: number = Button.HEIGHT;
    hovered: boolean = false;

    onClick: () => void = () => {};

    constructor(text: string, x: number, y: number) {
        this.pos = new Vec2(x, y);
        this.text = new Text(text, x + this.w / 2, y + this.h / 2);
        this.text.align = "center";
        this.text.baseline = "middle";
        this.text.font = "25px serif";
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.hovered) {
            ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
        } else {
            ctx.lineWidth = 2;
            ctx.strokeRect(this.pos.x, this.pos.y, this.w, this.h);
        }

        if (this.hovered) {
            ctx.fillStyle = "#fff";
        }

        this.text.draw(ctx);
    }
}
