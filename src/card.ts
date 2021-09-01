import { toFixed } from "./utils";
import { Canvas } from "./canvas";
import { Vec2 } from "./vec2";
import { Color } from "./color";

type CardColor = {
    front: Color;
    back: Color;
}

export class Card {
    static WIDTH = 3 * Canvas.TILE;
    static HEIGHT = 4 * Canvas.TILE;

    pos: Vec2;
    center: Vec2;
    color: CardColor;

    w: number = Card.WIDTH;
    h: number = Card.HEIGHT;
    scale: number = 1;
    dscale: number = 0;
    alpha: number = 1;
    dalpha: number = 0;

    constructor(x: number, y: number, frontColor: Color) {
        this.pos = new Vec2(x, y);
        this.center = new Vec2(x + this.w / 2, y + this.h / 2);
        this.color = { back: new Color(0, 0, 0), front: frontColor };
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.scale(this.scale, 1);
        ctx.translate(-this.center.x, -this.center.y);

        if (window.showCardFront) {
            ctx.fillStyle = this.color.front.toString();
        } else {
            ctx.fillStyle = this.scale > 0
                ? this.color.back.toString()
                : this.color.front.toString();
        }

        ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color.back.toString();
        ctx.strokeRect(this.pos.x, this.pos.y, this.w, this.h);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
    }

    update(dt: number) {
        if (this.dscale === 0 && this.dalpha === 0) return;

        this.scale = toFixed(this.scale + this.dscale * dt, 1);
        if (this.scale <= -1 || this.scale >= 1) {
            this.dscale = 0;
        }

        this.alpha += this.dalpha * dt;
        if (this.alpha >= 1 || this.alpha <= 0) {
            this.dalpha = 0;
        }

        this.color.front.a = this.alpha;
        this.color.back.a = this.alpha;
    }
}
