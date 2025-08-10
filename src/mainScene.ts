import Phaser from 'phaser';
import { GameEngine } from './gameEngine';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "matter",
  },
  scene: GameEngine
};

new Phaser.Game(config);