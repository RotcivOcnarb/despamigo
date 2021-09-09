import AmogusScene from "../scenes/Game";
import Vector2 from "../utils/Vector2";
import BulletPattern from "./BulletPattern";

export default class Upload extends BulletPattern{


    game: AmogusScene;
    amoguses = [];

    start: number;
    graphics: Phaser.GameObjects.Graphics;
    uploadText: Phaser.GameObjects.Text;

    constructor(game: AmogusScene){
        super();
        this.game = game;
    }

    preload() {
        this.game.load.spritesheet("among_sheet", "/assets/patterns/among_animation.png", { frameWidth: 31, frameHeight: 37});

        this.game.load.image("fd_send_closed", "/assets/patterns/fd_send_closed.png");
        this.game.load.image("fd_send_open", "/assets/patterns/fd_send_open.png");
        this.game.load.image("fd_receive_closed", "/assets/patterns/fd_receive_closed.png");
        this.game.load.image("fd_receive_open", "/assets/patterns/fd_receive_open.png");
    }

    create() {
        this.game.anims.create({
            key: "among_anim",
            frames: this.game.anims.generateFrameNumbers("among_sheet", {frames: [0, 1, 2, 3]}),
            frameRate: 8,
            repeat: -1
        });

    }

    fontload() {

    }

    reset() {

        this.start = this.game.gameTime;

        this.graphics = this.game.add.graphics();

        var send = this.game.add.image(this.game.screen_size.x * 0.2, this.game.screen_size.y * 0.6, "fd_send_closed");
        send.setScale(2);
        var receive = this.game.add.image(this.game.screen_size.x * 0.8, this.game.screen_size.y * 0.6, "fd_receive_closed");
        receive.setScale(2);

        this.uploadText = this.game.add.text(this.game.screen_size.x * 0.8 - 200 - 20, this.game.screen_size.y * 0.6 + 150, "Uploading... 0%", {
            fontFamily: 'Determination',
            fontSize: "30px",
            color: '#ffffff',
          });


        setTimeout(() => {
            send.destroy();
            receive.destroy();
            this.graphics.destroy();
            this.uploadText.destroy();
        }, 6000);

        var c = 10;
        if(this.game.hardMode) c = 50;

        for(var i = 0; i < c; i ++){
            var step = (6000/2 / c);
            setTimeout(() => {
                var sp = this.game.add.sprite(this.game.screen_size.x * 0.2, this.game.screen_size.y * 0.6, "");
                sp.play("among_anim");
                sp.setScale(2);
                this.game.bullets.push(sp);
                this.amoguses.push({
                    sprite: sp,
                    offy: this.randomRange(-200, 200),
                    progress: 0
                });
                send.setTexture("fd_send_open");
            }, step * i + 500);

            setTimeout(() => {
                send.setTexture("fd_send_closed");
            }, step * i + 650);

            setTimeout(() => {
                receive.setTexture("fd_receive_open");
            }, step * i + 2500);

            setTimeout(() => {
                receive.setTexture("fd_receive_closed");
            }, step * i + 2650);

        }
    }

    randomRange(min: number, max: number){
        return Math.random() * (max - min) + min;
    }

    update(dt: number) {

        for(var i = 0; i < this.amoguses.length; i ++){
            this.amoguses[i].progress += dt / 1000 / 2;
            var position = Vector2.lerp(
                this.game.screen_size.clone().mul(new Vector2(0.2, 0.6)),
                this.game.screen_size.clone().mul(new Vector2(0.8, 0.6)),
                this.amoguses[i].progress
            )

            if(this.amoguses[i].sprite){
                var offY = Math.sin(this.amoguses[i].progress * 10) * 50 + this.amoguses[i].offy;
                this.amoguses[i].progress = Math.min(1, this.amoguses[i].progress);
                offY *= Math.pow(Math.sin(Math.PI * this.amoguses[i].progress), 0.4);
                this.amoguses[i].sprite.setPosition(position.x, position.y + offY);
                if(this.amoguses[i].progress >= 1){
                    this.amoguses[i].sprite.destroy();
                }
            }
        }

        this.graphics.clear();

        var prog = (this.game.gameTime - this.start)/5;
        prog = Math.max(prog, 0),
        prog = Math.min(prog, 1);

        this.uploadText.setText("Uploading... " + Math.floor(prog * 100) + "%");

        this.graphics.fillStyle(0x00A50D, 1);
        this.graphics.fillRect(
            this.game.screen_size.x * 0.8 - 200 - 20,
            this.game.screen_size.y * 0.6 + 100,
            400 * prog, 40
        )


        this.graphics.lineStyle(4, 0xffffff, 1);
        this.graphics.strokeRect(
            this.game.screen_size.x * 0.8 - 200 - 20,
            this.game.screen_size.y * 0.6 + 100,
            400, 40
        )



    }

    finished() {

        if(this.game.gameTime - this.start > 6){
            return true;
        }

    }
}
