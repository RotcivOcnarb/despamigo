import Phaser from 'phaser';
export default {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    parent: 'game',
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            debugShowVelocity: false,
            gravity: { y: 0 }
        }
    },
};
