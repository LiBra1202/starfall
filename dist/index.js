import Phaser from 'phaser';
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload() {
            // načti assets
        },
        create() {
            this.add.text(100, 100, 'Ahoj, světe!', { color: '#ffffff' });
        }
    }
};
new Phaser.Game(config);
