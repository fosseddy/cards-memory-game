export class Color {
    constructor(
            public r: number,
            public g: number,
            public b: number,
            public a: number = 1) {}

    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    isEqualTo(c: Color): boolean {
        return (
            this.r === c.r &&
            this.g === c.g &&
            this.b === c.b &&
            this.a === c.a
        );
    }
}
