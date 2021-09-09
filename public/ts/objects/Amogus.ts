import Phaser from 'phaser';
import AmogusScene from "../scenes/Game";
import Vector2 from '../utils/Vector2';

export default class Amogus {

    body_parts = [
        "amogus_backpack",
        "amogus_body",
        "amogus_foot",
        "amogus_visor",
        "amogus_arm"
    ];

    body_images = {};
    body_position = {};

    game: AmogusScene;
    origin: Vector2;
    amogus_position: Vector2;
    bubble: Phaser.GameObjects.Image;
    bubble_text: Phaser.GameObjects.Text;
    text_start: number = 0;
    bubble_string: string = "Faaala meme";
    shake: number = 0;
    health: number = 300;
    tweened_health: number = 300;
    wave_pattern: number = 1;

    graphics: Phaser.GameObjects.Graphics;
    damage_text: Phaser.GameObjects.Text;
    damage_text_rev: Phaser.GameObjects.Text;

    textIndex: number;

    constructor(scene: AmogusScene) {
        this.game = scene;



        this.origin = new Vector2(
            this.game.screen_size.x/2,
            this.game.screen_size.y* 0.25
        )

        this.amogus_position = new Vector2(
            (this.game.screen_size.x as number)/2,
            (this.game.screen_size.y as number)/2
        )
    }

    preload() {
    
        this.game.load.image('amogus_body', '/assets/amogus/body.png');
        this.game.load.image('amogus_arm', '/assets/amogus/arm.png');
        this.game.load.image('amogus_backpack', '/assets/amogus/backpack.png');
        this.game.load.image('amogus_foot', '/assets/amogus/foot.png');
        this.game.load.image('amogus_visor', '/assets/amogus/visor.png');

        this.game.load.image('speech_bubble', '/assets/text_bubble.png')
    }

    fontload(){
        this.bubble_text = this.game.add.text(1140, 120, "", {
            fontFamily: 'Determination',
            fontSize: "30px",
            color: '#000000',
            wordWrap: { 
              width: 350
            }
          });
        this.bubble_text.setVisible(false);


        this.damage_text = this.game.add.text(this.game.screen_size.x/2 + 50, this.game.screen_size.y * 0.25, "15", {
            fontFamily: 'Attack',
            fontSize: "40px",
            color: '#000000',
        });
        this.damage_text.setStroke("#ff0000", 7)
        this.damage_text.setVisible(false);


    }

    create() {

        for(var i = 0; i < this.body_parts.length; i ++){
            var part_name = this.body_parts[i];

            this.body_images[part_name] = this.game.add.image(this.amogus_position.x, this.amogus_position.y, part_name);
            this.body_images[part_name].setScale(3);
            this.body_position[part_name] = new Vector2(0, 0);
        }

        this.bubble = this.game.add.image(1300, 200, 'speech_bubble');
        this.bubble.setScale(2);
        this.bubble.setVisible(false);

        this.graphics = this.game.add.graphics();
        this.graphics.setVisible(false);

    }

    openTextBubble(message: string, timeout: number){
        this.bubble_string = message;
        this.text_start = this.game.gameTime;
        this.bubble.setVisible(true);
        if(this.bubble_text)
            this.bubble_text.setVisible(true);

        setTimeout(() => {
            if(this.bubble_text)
                this.bubble_text.setVisible(false);

            this.bubble.setVisible(false);

        }, timeout * 1000);
    }

/*
        "amogus_backpack",
        "amogus_body",
        "amogus_foot",
        "amogus_visor",
        "amogus_arm"
*/

    update(timestep, dt){

        var time = timestep / 1000;

        //Backpack
        this.body_position['amogus_backpack'].y = Math.sin(time*7)*7 * this.wave_pattern;
        
        this.body_images['amogus_backpack'].setPosition(
            this.amogus_position.x + this.body_position['amogus_backpack'].x,
            this.amogus_position.y + this.body_position['amogus_backpack'].y
        );
            
        //Visor
        this.body_position['amogus_visor'].y = Math.sin((time+1.2)*8)*3 * this.wave_pattern;
            
        this.body_images['amogus_visor'].setPosition(
            this.amogus_position.x + this.body_position['amogus_visor'].x,
            this.amogus_position.y + this.body_position['amogus_visor'].y
        );
            
        //Arm
        this.body_position['amogus_arm'].y = Math.sin((time+0.7)*9)*4 * this.wave_pattern;
            
        this.body_images['amogus_arm'].setPosition(
            this.amogus_position.x + this.body_position['amogus_arm'].x,
            this.amogus_position.y + this.body_position['amogus_arm'].y
        );
        
        //foot
        this.body_position['amogus_foot'].y = Math.sin((time+2.2)*8)*4 * this.wave_pattern;
            
        this.body_images['amogus_foot'].setPosition(
            this.amogus_position.x + this.body_position['amogus_foot'].x,
            this.amogus_position.y + this.body_position['amogus_foot'].y
        );
        
        this.shake += (0 - this.shake) / 10 * dt/1000 * 60;
        
        this.amogus_position.x = this.origin.x + Math.sin((time+2.2)*3)*20 * this.wave_pattern +
            Math.sin(time*50) * this.shake * 20;

        this.amogus_position.y = this.origin.y + Math.sin((time+2.2)*6)*10 * this.wave_pattern;
        
        //Body	
        this.body_images['amogus_body'].setPosition(
            this.amogus_position.x,
            this.amogus_position.y
            );

        if(this.bubble_text){	
            var cts = Math.floor((this.game.gameTime - this.text_start) * 20);
            cts = Math.min(Math.max(0, cts), this.bubble_string.length);
            this.bubble_text.setText(this.bubble_string.substring(0, cts));

            if(this.textIndex != cts){
                if(this.bubble_string.substring(cts-1, cts) != " ")
                this.game.voice.play();
              }
        
              this.textIndex = cts;
        }

        this.tweened_health += (this.health - this.tweened_health) / 10 * dt/1000 * 60;

        this.graphics.fillStyle(0x434042, 1);
        this.graphics.fillRect(this.game.screen_size.x/2 - 150, this.game.screen_size.y * 0.3, 300, 20);

        this.graphics.fillStyle(0x00d800, 1);
        this.graphics.fillRect(this.game.screen_size.x/2 - 150, this.game.screen_size.y * 0.3, 300 * (this.tweened_health/300), 20);

        this.graphics.lineStyle(3, 0x000000, 1);
        this.graphics.strokeRect(this.game.screen_size.x/2 - 150, this.game.screen_size.y * 0.3, 300, 20);

        for(var i = 0; i < this.death_particles.length; i ++){
            var part = this.death_particles[i];

            var time = this.game.gameTime - part.time;
            if(time > 0){
                part.position.add(part.velocity.clone().scale(dt / 1000));
                part.image.setPosition(part.position.x, part.position.y);
                part.image.setAlpha(1 - time*5);
            }
        }

    }

    setSpared(){
        this.body_images['amogus_backpack'].setAlpha(0.5);
        this.body_images['amogus_body'].setAlpha(0.5);
        this.body_images['amogus_foot'].setAlpha(0.5);
        this.body_images['amogus_arm'].setAlpha(0.5);
        this.body_images['amogus_visor'].setAlpha(0.5);

        this.wave_pattern = 0.1;
    }

    death_particles = [];
    death_time: number = 0;

    damage(amount: number){
        this.health -= amount;
        this.health = Math.max(this.health, 0);

        if(this.health <= 0){

            setTimeout(() => {
                this.wave_pattern = 0;
                this.update(0, 0);
                var textureManager = this.game.textures;
                var add = this.game.add;
    
                this.game.renderer.snapshotArea(this.amogus_position.x - 200, this.amogus_position.y - 200, 400, 400, (image) => {
                    document.body.appendChild(image as HTMLImageElement);
                    if (textureManager.exists('amogus_snap')) textureManager.remove('amogus_snap');
                    textureManager.addImage("amogus_snap", image as HTMLImageElement);
    
                    this.death_time = this.game.gameTime;

                    for(var i = 0; i < 10; i ++){
                        for(var j = 0; j < 100; j ++){
                            var stepX = 40 * i;
                            var stepY = 4 * j;

                            var snap = add.image(this.amogus_position.x, this.amogus_position.y, "amogus_snap");
                            snap.setCrop(new Phaser.Geom.Rectangle(stepX, stepY, 40, 4));

                            this.death_particles.push({
                                image: snap,
                                time: this.game.gameTime + j / 80 + 0.5,
                                velocity: new Vector2(0, -400).rotate(this.randomRange(-0.5, 0.5)),
                                position: this.amogus_position.clone()
                            });
                        }
                    }

                    this.body_images['amogus_backpack'].setVisible(false);
                    this.body_images['amogus_body'].setVisible(false);
                    this.body_images['amogus_foot'].setVisible(false);
                    this.body_images['amogus_arm'].setVisible(false);
                    this.body_images['amogus_visor'].setVisible(false);
    
                });
            }, 500);

            setTimeout(() => {
                this.game.exitBattle("You defeated AMOGUS");
                this.game.gameFinished = true;
            }, 3000);

        }
        else{
            this.graphics.setVisible(true);
            this.damage_text.setVisible(true);
            this.damage_text.setText(amount.toString());
        }

        setTimeout(() => {
            this.graphics.setVisible(false);
            this.damage_text.setVisible(false);
        }, 1000);
        
    }
    
    randomRange(min: number, max: number){
        return Math.random() * (max - min) + min;
    }
}