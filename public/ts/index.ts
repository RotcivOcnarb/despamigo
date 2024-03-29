import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import GameOver from './scenes/GameOver';

var game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene, GameOver]
  })
);
