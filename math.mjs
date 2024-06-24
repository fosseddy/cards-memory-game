export class Vec2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Vec4 {
    x;
    y;
    z;
    w;
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
//# sourceMappingURL=math.mjs.map