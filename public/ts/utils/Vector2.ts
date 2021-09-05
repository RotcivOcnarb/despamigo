export default class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    add(other: Vector2){
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    mul(other: Vector2){
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }

    scale(scl: number){
        this.x *= scl;
        this.y *= scl;
    }

    rotate(angle: number){
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
         
        var tx = this.x;
        var ty = this.y;
        this.x = (cos * tx) - (sin * ty);
        this.y = (sin * tx) + (cos * ty);
        return this;
    }
}