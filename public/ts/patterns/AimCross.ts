import AmogusScene from "../scenes/Game";
import Vector2 from "../utils/Vector2";
import BulletPattern from "./BulletPattern";

export default class AimCross extends BulletPattern{


    game: AmogusScene;
    graphics: Phaser.GameObjects.Graphics;
    start: number;

    linePosition: Vector2
    lineVelocity: Vector2;
    targetPoint: Vector2;

    constructor(game: AmogusScene){
        super();
        this.game = game;
    }

    preload() {
        
    }
    create() {
        this.graphics = this.game.add.graphics();

    }

    fontload() {
    }

    reset() {
        this.start = this.game.gameTime;
        this.linePosition = new Vector2(this.game.screen_size.x * 0.7, this.game.screen_size.y * 0.3);
        this.lineVelocity = new Vector2(0, 0);
        this.targetPoint = new Vector2(this.game.screen_size.x * 0.5, this.game.screen_size.y * 0.6);


        var tmt = 500;
        if(this.game.hardMode) tmt = 100;
        for(var i = 0; i < 30; i ++){
            setTimeout(() => {
                this.targetPoint = new Vector2(this.game.screen_size.x * this.randomRange(0.3, 0.7), this.game.screen_size.y *this.randomRange(0.4, 0.8));
            }, tmt * i + tmt);
        }



    }
    update(dt: number) {
        this.graphics.clear();

        //Vertical
        this.graphics.lineStyle(8, 0xff6e00, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(this.linePosition.x, this.linePosition.y);
        this.graphics.lineTo(this.linePosition.x, this.linePosition.y + 2000);
        this.graphics.lineTo(this.linePosition.x, this.linePosition.y - 2000);
        this.graphics.closePath();
        this.graphics.strokePath();

        //Horizontal
        this.graphics.lineStyle(8, 0x073dff, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(this.linePosition.x, this.linePosition.y);
        this.graphics.lineTo(this.linePosition.x + 2000, this.linePosition.y);
        this.graphics.lineTo(this.linePosition.x - 2000, this.linePosition.y);
        this.graphics.closePath();
        this.graphics.strokePath();

        //Circle
        this.graphics.lineStyle(8, 0xffffff, 1);
        this.graphics.strokeCircle(this.linePosition.x, this.linePosition.y, 40)

        this.linePosition.add(this.lineVelocity.clone().scale(dt/1000));

        var spd = 2;
        if(this.game.hardMode) spd = 10;

        this.lineVelocity.add(
            this.targetPoint.clone().sub(this.linePosition).normalize().scale(dt * spd)
        )

        var maxVel = 500;
        if(this.game.hardMode) maxVel = 2000;
        if(this.lineVelocity.magnitude() > maxVel){
            this.lineVelocity = this.lineVelocity.normalize().scale(200);
        }

        var heartRect = new Phaser.Geom.Rectangle(
            this.game.heartPosition.x - 10, this.game.heartPosition.y - 10, 20, 20
        );

        //Damage vertical
        if(Phaser.Geom.Intersects.LineToRectangle(new Phaser.Geom.Line(
            this.linePosition.x, this.linePosition.y + 2000, 
            this.linePosition.x, this.linePosition.y - 2000
        ), heartRect)){
            if(!this.game.heartMoving)
             this.game.damagePlayer();
        }

        //damage Horizontal
        if(Phaser.Geom.Intersects.LineToRectangle(new Phaser.Geom.Line(
            this.linePosition.x + 2000, this.linePosition.y, 
            this.linePosition.x - 2000, this.linePosition.y
        ), heartRect)){
            if(this.game.heartMoving)
                this.game.damagePlayer();
        }

        if(Phaser.Geom.Intersects.CircleToRectangle(new Phaser.Geom.Circle(this.linePosition.x, this.linePosition.y, 40), heartRect)){
            this.game.damagePlayer();
        }

    }

    randomRange(min: number, max: number){
        return Math.random() * (max - min) + min;
    }

    finished() {

        if(this.game.gameTime - this.start > 5){
            this.graphics.clear();
            return true;
        }
    }

}