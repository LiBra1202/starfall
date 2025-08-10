import Phaser from 'phaser';
import { GameEngine } from './gameEngine';

export class LoadGame {
    public static run(scene: GameEngine) {
        
        scene.clearStars();

        //po každém kole odebere hvězdičky na pozadí
        scene.star_bg.forEach(star => star.destroy());
        scene.star_bg = [];

        scene.add.image(400, 300, 'sky').setDepth(0);

        //hvězdičky na pozadí
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);

            const s = scene.add.image(x, y, 'star_bg')
                .setAlpha(Phaser.Math.FloatBetween(0.2, 1))
                .setScale(Phaser.Math.FloatBetween(0.5, 1))
                .setDepth(1); // před sky.jpg, za vším ostatním

            scene.tweens.add({
                targets: s,
                alpha: { from: 0.2, to: 1 },
                duration: Phaser.Math.Between(500, 1500),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });

            scene.star_bg.push(s);
        }
        
        const starCountThisRun = Phaser.Math.Between(1, 15);

        for (let i = 0; i < starCountThisRun; i++) 
        {
            scene.addStar();
        }

        if (starCountThisRun === scene.MAX_STARS) 
        {
            scene.showCelebration();
        }

        scene.ground = scene.matter.add.image(400, 560, 'ground', undefined, { isStatic: true }).setDepth(2);

        // vytvoří info text a posune do horní vrsty
        scene.fadeText('Klikni a odstraníš zem');
        scene.children.bringToTop(scene.infoText);

        //zviditelní počítadlo
        scene.starCounterText.setVisible(true);
        scene.children.bringToTop(scene.starCounterText);

        //přidá tlačítko na resetování počítadla
        scene.resetButton.setVisible(true);
        scene.children.bringToTop(scene.resetButton);
    }
}    
