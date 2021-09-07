
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

    sub(other: Vector2){
        this.x -= other.x;
        this.y -= other.y;
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
        return this;
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

    clone(){
        return new Vector2(this.x, this.y);
    }

    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(){
        var mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    static lerp(a: Vector2, b: Vector2, alpha: number){
        var lerp = (value1, value2, amount) => {
            amount = Math.max(0, amount);
            amount = Math.min(1, amount);
            return (1 - amount) * value1 + amount * value2;
        }
        return new Vector2(lerp(a.x, b.x, alpha), lerp(a.y, b.y, alpha));
    }
}