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


    constructor(scene: AmogusScene) {
        this.game = scene;



        this.origin = {
            x: this.game.screen_size.x/2,
            y: this.game.screen_size.y* 0.25
        }

        this.amogus_position = {
            x: (this.game.screen_size.x as number)/2,
            y: (this.game.screen_size.y as number)/2
        }
    }

    preload() {
    
        this.game.load.image('amogus_body', '/assets/amogus/body.png');
        this.game.load.image('amogus_arm', '/assets/amogus/arm.png');
        this.game.load.image('amogus_backpack', '/assets/amogus/backpack.png');
        this.game.load.image('amogus_foot', '/assets/amogus/foot.png');
        this.game.load.image('amogus_visor', '/assets/amogus/visor.png');
    }

    create() {

        for(var i = 0; i < this.body_parts.length; i ++){
            var part_name = this.body_parts[i];

            this.body_images[part_name] = this.game.add.image(this.amogus_position.x, this.amogus_position.y, part_name);
            this.body_images[part_name].setScale(3);
            this.body_position[part_name] = new Vector2(0, 0);
        }
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
        this.body_position['amogus_backpack'].y = Math.sin(time*7)*7;
        
        this.body_images['amogus_backpack'].setPosition(
            this.amogus_position.x + this.body_position['amogus_backpack'].x,
            this.amogus_position.y + this.body_position['amogus_backpack'].y
        );
            
        //Visor
        this.body_position['amogus_visor'].y = Math.sin((time+1.2)*8)*3;
            
        this.body_images['amogus_visor'].setPosition(
            this.amogus_position.x + this.body_position['amogus_visor'].x,
            this.amogus_position.y + this.body_position['amogus_visor'].y
        );
            
        //Arm
        this.body_position['amogus_arm'].y = Math.sin((time+0.7)*9)*4;
            
        this.body_images['amogus_arm'].setPosition(
            this.amogus_position.x + this.body_position['amogus_arm'].x,
            this.amogus_position.y + this.body_position['amogus_arm'].y
        );
        
        //foot
        this.body_position['amogus_foot'].y = Math.sin((time+2.2)*8)*4;
            
        this.body_images['amogus_foot'].setPosition(
            this.amogus_position.x + this.body_position['amogus_foot'].x,
            this.amogus_position.y + this.body_position['amogus_foot'].y
        );
        
        
        this.amogus_position.x = this.origin.x + Math.sin((time+2.2)*3)*20;
        this.amogus_position.y = this.origin.y + Math.sin((time+2.2)*6)*10;
        
        //Body	
        this.body_images['amogus_body'].setPosition(
            this.amogus_position.x,
            this.amogus_position.y
            );
    }
    
}