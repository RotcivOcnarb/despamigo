import Vector2 from '../utils/Vector2';
export default class Amogus {
    constructor(scene) {
        this.body_parts = [
            "amogus_backpack",
            "amogus_body",
            "amogus_foot",
            "amogus_visor",
            "amogus_arm"
        ];
        this.body_images = {};
        this.body_position = {};
        this.text_start = 0;
        this.bubble_string = "Faaala meme";
        this.game = scene;
        this.origin = new Vector2(this.game.screen_size.x / 2, this.game.screen_size.y * 0.25);
        this.amogus_position = new Vector2(this.game.screen_size.x / 2, this.game.screen_size.y / 2);
    }
    preload() {
        this.game.load.image('amogus_body', '/assets/amogus/body.png');
        this.game.load.image('amogus_arm', '/assets/amogus/arm.png');
        this.game.load.image('amogus_backpack', '/assets/amogus/backpack.png');
        this.game.load.image('amogus_foot', '/assets/amogus/foot.png');
        this.game.load.image('amogus_visor', '/assets/amogus/visor.png');
        this.game.load.image('speech_bubble', '/assets/text_bubble.png');
    }
    fontload() {
        this.bubble_text = this.game.add.text(1140, 120, "", {
            fontFamily: 'Determination',
            fontSize: "30px",
            color: '#000000',
            wordWrap: {
                width: 350
            }
        });
        this.bubble_text.setVisible(false);
    }
    create() {
        for (var i = 0; i < this.body_parts.length; i++) {
            var part_name = this.body_parts[i];
            this.body_images[part_name] = this.game.add.image(this.amogus_position.x, this.amogus_position.y, part_name);
            this.body_images[part_name].setScale(3);
            this.body_position[part_name] = new Vector2(0, 0);
        }
        this.bubble = this.game.add.image(1300, 200, 'speech_bubble');
        this.bubble.setScale(2);
        this.bubble.setVisible(false);
    }
    openTextBubble(message, timeout) {
        this.bubble_string = message;
        this.text_start = this.game.gameTime;
        this.bubble.setVisible(true);
        if (this.bubble_text)
            this.bubble_text.setVisible(true);
        setTimeout(() => {
            if (this.bubble_text)
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
    update(timestep, dt) {
        var time = timestep / 1000;
        //Backpack
        this.body_position['amogus_backpack'].y = Math.sin(time * 7) * 7;
        this.body_images['amogus_backpack'].setPosition(this.amogus_position.x + this.body_position['amogus_backpack'].x, this.amogus_position.y + this.body_position['amogus_backpack'].y);
        //Visor
        this.body_position['amogus_visor'].y = Math.sin((time + 1.2) * 8) * 3;
        this.body_images['amogus_visor'].setPosition(this.amogus_position.x + this.body_position['amogus_visor'].x, this.amogus_position.y + this.body_position['amogus_visor'].y);
        //Arm
        this.body_position['amogus_arm'].y = Math.sin((time + 0.7) * 9) * 4;
        this.body_images['amogus_arm'].setPosition(this.amogus_position.x + this.body_position['amogus_arm'].x, this.amogus_position.y + this.body_position['amogus_arm'].y);
        //foot
        this.body_position['amogus_foot'].y = Math.sin((time + 2.2) * 8) * 4;
        this.body_images['amogus_foot'].setPosition(this.amogus_position.x + this.body_position['amogus_foot'].x, this.amogus_position.y + this.body_position['amogus_foot'].y);
        this.amogus_position.x = this.origin.x + Math.sin((time + 2.2) * 3) * 20;
        this.amogus_position.y = this.origin.y + Math.sin((time + 2.2) * 6) * 10;
        //Body	
        this.body_images['amogus_body'].setPosition(this.amogus_position.x, this.amogus_position.y);
        if (this.bubble_text) {
            var cts = Math.floor((this.game.gameTime - this.text_start) * 20);
            cts = Math.min(Math.max(0, cts), this.bubble_string.length);
            this.bubble_text.setText(this.bubble_string.substring(0, cts));
        }
    }
}
