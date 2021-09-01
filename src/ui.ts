import { Canvas } from "./canvas";
import { Vec2 } from "./vec2";

export const BUTTON_WIDTH = Canvas.TILE * 10;
export const BUTTON_HEIGHT = Canvas.TILE * 3;

enum UIElementType {
  Text = 0,
  Button
}

type UIBaseElement = {
  type: UIElementType;
  pos: Vec2;
}

type Text = UIBaseElement & {
  align: CanvasTextAlign | "";
  baseline: CanvasTextBaseline | "";
  text: string;
  font: string;
}

type Button = UIBaseElement & {
  text: Text;
  w: number;
  h: number;
  hovered: boolean;
  onClick: () => void;
}

export type UIElement = Text | Button

export function text(t: string, x: number, y: number): Text {
  return {
    type: UIElementType.Text,
    pos: new Vec2(x, y),
    text: t,
    align: "",
    baseline: "",
    font: ""
  };
}

export function button(t: string, x: number, y: number): Button {
  const w = BUTTON_WIDTH;
  const h = BUTTON_HEIGHT;
  const btnText = text(t, x + w / 2, y + h / 2);
  btnText.align = "center";
  btnText.baseline = "middle";
  btnText.font = "25px serif";

  return {
    type: UIElementType.Button,
    text: btnText,
    pos: new Vec2(x, y),
    w, h,
    hovered: false,
    onClick: () => {}
  };
}

export function draw(e: UIElement, ctx: CanvasRenderingContext2D) {
  switch (e.type) {
    case UIElementType.Text: {
      textDraw(e as Text, ctx);
    } break;

    case UIElementType.Button: {
      buttonDraw(e as Button, ctx);
    } break;

    default:
      return;
  }
}

function textDraw(t: Text, ctx: CanvasRenderingContext2D) {
  const { text, align, baseline, font } = t;
  const { x, y } = t.pos;

  if (align) ctx.textAlign = align;
  if (baseline) ctx.textBaseline = baseline;
  if (font) ctx.font = font;

  ctx.fillText(text, x, y);
}

function buttonDraw(b: Button, ctx: CanvasRenderingContext2D) {
  const { x, y } = b.pos;
  const { w, h, hovered, text } = b;

  if (hovered) {
    ctx.fillRect(x, y, w, h);
  } else {
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }

  if (hovered) {
    ctx.fillStyle = "#fff";
  }

  textDraw(text, ctx);
}
