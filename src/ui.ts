import { Canvas } from "./canvas";
import { Color } from "./color";
import { Vec2 } from "./vec2";

interface Hoverable {
    hovered: boolean;
    hoveredColor: Color;
}

interface UIElementBase {
    pos: Vec2;
    color: Color;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

interface UIElementText extends UIElementBase {
    text: string;
    font: string;
    align: CanvasTextAlign | "";
    baseline: CanvasTextBaseline | "";
}

interface UIElementButton extends UIElementBase, Hoverable {
    text: Text;
    w: number;
    h: number;
    onClick: () => void;
}

export class Text implements UIElementText {
    pos: Vec2;
    text: string;

    color = new Color(0, 0, 0);
    align: CanvasTextAlign | "" = "";
    baseline: CanvasTextBaseline | "" = "";
    font: string = "";

    constructor(text: string, x: number, y: number) {
        this.pos = new Vec2(x, y);
        this.text = text;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        if (this.align) ctx.textAlign = this.align;
        if (this.baseline) ctx.textBaseline = this.baseline;
        if (this.font) ctx.font = this.font;

        ctx.fillStyle = this.color.toString();
        ctx.fillText(this.text, this.pos.x, this.pos.y);
        ctx.restore();
    }
}

export class Button implements UIElementButton {
    static WIDTH = Canvas.TILE * 10;
    static HEIGHT = Canvas.TILE * 3;

    pos: Vec2;
    text: Text;

    w = Button.WIDTH;
    h = Button.HEIGHT;
    hovered = false;
    color = new Color(0, 0, 0);
    hoveredColor = new Color(255, 255, 255);

    onClick = () => {};

    constructor(text: string, x: number, y: number) {
        this.pos = new Vec2(x, y);
        this.text = new Text(text, x + this.w / 2, y + this.h / 2);
        this.text.align = "center";
        this.text.baseline = "middle";
        this.text.font = "25px serif";
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        if (this.hovered) {
            ctx.fillStyle = this.color.toString();
            ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
            this.text.color = this.hoveredColor;
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.color.toString();
            ctx.strokeRect(this.pos.x, this.pos.y, this.w, this.h);
            this.text.color = this.color;
        }

        ctx.restore();
        this.text.draw(ctx);
    }
}
