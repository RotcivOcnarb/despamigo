import { Input } from "phaser";
import AmogusScene from "../scenes/Game";
import Vector2 from "../utils/Vector2";
import BulletPattern from "./BulletPattern";



export default class Alavanca extends BulletPattern {

    time: number;
    game: AmogusScene;

    alavanca;
    alavanca_base;

    folhas = [];

    constructor(game: AmogusScene){
        super();
        this.game = game;
    }

    preload(){
        this.game.load.image('alavanca_base', '/assets/patterns/alavanca_base.png');
        this.game.load.image('alavanca', '/assets/patterns/alavanca.png');

        this.game.load.image("folha1", '/assets/patterns/folha1.png');
        this.game.load.image("folha2", '/assets/patterns/folha2.png');
        this.game.load.image("folha3", '/assets/patterns/folha3.png');
    }

    create(){
        this.alavanca_base = this.game.add.image(this.game.screen_size.x*0.7, this.game.screen_size.y * 0.6, 'alavanca_base');
        this.alavanca_base.setScale(3);
        this.alavanca_base.setAlpha(0);

        this.alavanca = this.game.add.image(this.game.screen_size.x*0.7, this.game.screen_size.y * 0.6, 'alavanca');
        this.alavanca.setScale(3);
        this.alavanca.setAlpha(0);
    }

    fontload() {
        
    }

    reset(){
        this.time = 0;
        this.alavanca_base.setAlpha(0);
        this.alavanca.setAlpha(0);

        for(var i = 0; i < this.folhas.length; i ++){
            this.folhas[i].image.destroy();
        }

        this.folhas = [];

        var f = [
            "folha1",
            "folha2",
            "folha3"
        ]

        var c = 5;
        if(this.game.hardMode) c = 50;

        for(var i = 0; i < c; i ++){

            var position = new Vector2(
                this.randomRange(this.game.screen_size.x * 0.4, this.game.screen_size.x * 0.6),
                this.randomRange(this.game.screen_size.y * 0.1, this.game.screen_size.y * 0.3)
            );

            if(this.game.hardMode){
                position = new Vector2(
                    this.randomRange(this.game.screen_size.x * 0.3, this.game.screen_size.x * 0.7),
                    this.randomRange(this.game.screen_size.y * - 0.3, this.game.screen_size.y * 0.3)
                );
            }

            var folha = this.game.physics.add.image(position.x, position.y, f[Math.floor(Math.random() * f.length)]);

            folha.setAlpha(0);
            folha.setRotation(this.randomRange(0, Math.PI*2));
            folha.setScale(3);

            this.folhas.push({
                begin: this.randomRange(1, 2),
                image: folha,
                position: position,
                velocity: 0,
                gravity: 0
            });

            this.game.bullets.push(folha);
        }
    }

    randomRange(min: number, max: number){
        return Math.random() * (max - min) + min;
    }

    update(delta) {
        var dt = delta/1000;
        this.time += dt;

        var alpha = 0;
        if(this.time < 1) alpha = (this.time - .5) * 10;
        else  alpha = 1 - (this.time - 4.5) * 10;
        
        this.alavanca_base.setAlpha(alpha);
        this.alavanca.setAlpha(alpha);

        for(var i = 0; i < this.folhas.length; i ++){
            this.folhas[i].image.setAlpha(alpha);

            if(this.time > this.folhas[i].begin){
                this.folhas[i].gravity = 600;
            }


            this.folhas[i].velocity += this.folhas[i].gravity * dt;
            this.folhas[i].position.y += this.folhas[i].velocity * dt;

            this.folhas[i].image.setPosition(
                this.folhas[i].position.x,
                this.folhas[i].position.y,
            );
        }

        var ty = (this.time - 1) * 6;
        ty = Math.max(ty, 0);
        var sy = this.lerp(3, -3, ty);
        this.alavanca.setScale(3, sy);

    }

    finished(){
        return this.time > 5;
    }

    lerp (value1, value2, amount) {
        amount = Math.max(0, amount);
        amount = Math.min(1, amount);
        return (1 - amount) * value1 + amount * value2;
    };

}