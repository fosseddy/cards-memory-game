export class Vec2 {
    constructor(
        public x: number,
        public y: number
    ) {}
}

export class Vec4 {
    constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number
    ) {}
}

export function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}
