import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,

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
	audio: {
        disableWebAudio: true
    },
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 1879,
		height: 939,
	}
};
