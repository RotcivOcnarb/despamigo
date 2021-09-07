import AmogusScene from "../scenes/Game";
import Vector2 from "../utils/Vector2";
import BulletPattern from "./BulletPattern";

export default class Asteroids extends BulletPattern{

    game: AmogusScene;
    asteroids = [];
    start: number;

    constructor(game: AmogusScene){
        super();
        this.game = game;
    }

    preload() {
        this.game.load.image("asteroid0", '/assets/patterns/asteroid0.png');
        this.game.load.image("asteroid1", '/assets/patterns/asteroid1.png');
        this.game.load.image("asteroid2", '/assets/patterns/asteroid2.png');
        this.game.load.image("asteroid3", '/assets/patterns/asteroid3.png');
    }

    create() {
        
    }

    fontload() {
        
    }

    reset() {
        this.start = this.game.gameTime;
        var origin = new Vector2(
            this.game.screen_size.x / 2, this.game.screen_size.y * 0.6
        )

        this.asteroids = [];

        for(var i = 0; i < 7; i ++){

            var randomCircle = new Vector2(
                this.randomRange(-1, 1),
                this.randomRange(-1, 0)
            ).normalize();

            var position = origin.clone().add(randomCircle.clone().scale(this.randomRange(300, 400)));

            var rng = Math.floor(this.randomRange(0, 4));

            var img = this.game.add.image(position.x, position.y, "asteroid" + rng);
            img.setScale(3);
            img.setRotation(this.randomRange(0, Math.PI * 2))

            var direction = origin.clone().sub(position).normalize().rotate(this.randomRange(-0.5, 0.5));

            this.asteroids.push({
                image: img,
                position: position,
                velocity: new Vector2(0, 0),
                acceleration: direction.clone().scale(100),
                start: this.game.gameTime + this.randomRange(0, 1)
            });

            this.game.bullets.push(img);
        }
    }

    randomRange(min: number, max: number){
        return Math.random() * (max - min) + min;
    }

    update(dt: any) {
        for(var i = 0; i < this.asteroids.length; i ++){
            var asteroid = this.asteroids[i];
            if(this.game.gameTime - asteroid.start > 0){
                asteroid.position.add(asteroid.velocity.clone().scale(dt/1000));
                asteroid.velocity.add(asteroid.acceleration.clone().scale(dt/1000));
            }
            asteroid.image.setPosition(asteroid.position.x, asteroid.position.y);
        }
    }
    finished() {
        if(this.game.gameTime - this.start > 5){
            for(var i = 0; i < this.asteroids.length; i ++){
                this.asteroids[i].image.destroy();
            }
            return true;
        }

        return false;
    }
    
}