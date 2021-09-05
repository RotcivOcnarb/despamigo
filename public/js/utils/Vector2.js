export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    mul(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    scale(scl) {
        this.x *= scl;
        this.y *= scl;
    }
    rotate(angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var tx = this.x;
        var ty = this.y;
        this.x = (cos * tx) - (sin * ty);
        this.y = (sin * tx) + (cos * ty);
        return this;
    }
}
