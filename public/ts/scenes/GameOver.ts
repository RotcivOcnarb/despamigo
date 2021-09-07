import Phaser from 'phaser';
import Vector2 from '../utils/Vector2';
import * as WebFont from "webfontloader";

export default class GameOver extends Phaser.Scene {

    heart: Phaser.GameObjects.Image;
    screen_size: Vector2;
    
    constructor(){
        super("GameOver");

        this.screen_size = new Vector2(
            window.innerWidth,
            window.innerHeight
          )
    }

    preload(){
        this.loadImage(this, "heart", "/assets");
        this.loadImage(this, "heart_break", "/assets");
        this.loadImage(this, "gameover", "/assets");

        this.load.spritesheet("heart_pieces", "/assets/heart_pieces.png", {frameWidth: 7, frameHeight: 8});

        this.load.audio('gameover', [
            'assets/audio/gameover.mp3'
          ]);

        this.loadAudioOggWav("break1", "/assets/audio");
        this.loadAudioOggWav("break2", "/assets/audio");
        this.loadAudioOggWav("voice", "/assets/audio");
    }

    loadAudioOggWav(name, path){
        this.load.audio(name, [
          //path + "/"+name+".ogg",
          path + "/"+name+".wav",
        ])
      }
    

    loadImage(game, id, path){
        game.load.image(id, path + "/" + id + ".png");
    }

    init(){
        this.addFont("Determination", "assets/fonts/Determination.ttf", "truetype");
    }
    
    addFont(name:string, path: string, format: string){
        var element = document.createElement('style');
        document.head.appendChild(element);
        var sheet = element.sheet as CSSStyleSheet;
        var styles = '@font-face { font-family: "'+name+'"; src: url("'+path+'") format("'+format+'"); }\n';
        sheet.insertRule(styles, 0);
    }

    create(){
        this.heart = this.add.image(this.screen_size.x /2 , this.screen_size.y * 0.7, 'heart');
        this.heart.setScale(2);

        WebFont.load({
            custom: {
                families: ['Determination']
            },
            active: function ()
            {

            }
          });

        var music = this.sound.add('gameover', {
        loop: true
        });
        

        var break1 = this.sound.add("break1");
        var break2 = this.sound.add("break2");
        var voice = this.sound.add("voice");

        setTimeout(() => {
            this.heart.setTexture("heart_break");
            break1.play();
        }, 100);

        setTimeout(() => {
            this.heart.setVisible(false);
            this.spawnParticle();
            break2.play();
        }, 1000);

        setTimeout(() => {

            music.play();
            var gameover = this.add.image(this.screen_size.x /2 , this.screen_size.y * 0.3, "gameover");
            gameover.setScale(1.5);
            gameover.setAlpha(0);

            var alpha = 0;

            setInterval(() => {
                alpha += 1/80;
                gameover.setAlpha(alpha);
            }, 1000/60);
        }, 2000);

        setTimeout(() => {

            var text = "The impostor is still among us...";

            var textObj = this.add.text(this.screen_size.x /2 - 300, this.screen_size.y * 0.6, "", {
                fontFamily: 'Determination',
                fontSize: "50px",
                color: '#ffffff',
              });

            var cont = 0;

            setInterval(() => {
                textObj.setText(text.substring(0, Math.min(cont, text.length)));
                if(cont < text.length){
                    voice.play();
                }

                cont++;
                
            }, 150);
            

        }, 3500);
    }

    spawnParticle(){
        var heartPart = this.add.particles("heart_pieces");
        heartPart.setScale(2);

        heartPart.createEmitter({
            x: this.screen_size.x /2 / 2,
            y: this.screen_size.y * 0.7 / 2,
            frame: [0, 1, 2, 3],
            quantity: 6,
            frequency: 50000,
            angle: {min: -180, max: 0},
            speed: 200,
            gravityY: 200,
            lifespan: 5000
        });

        setTimeout(() => {
            heartPart.setVisible(false);
            
        }, 5000);

    }
}