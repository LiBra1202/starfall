import Phaser from 'phaser';
import { InfoPanel } from './infoPanel';
import { LoadGame } from './loadGame';

export class GameEngine extends Phaser.Scene
{
    public infoText!: Phaser.GameObjects.Text;
    public starCounterText!: Phaser.GameObjects.Text;
    public celebrationText!: Phaser.GameObjects.Text;
    public celebrationTimer?: Phaser.Time.TimerEvent;
    public isCelebrationActive = false;
    public readonly MAX_STARS = 15;
    public stars: Phaser.Physics.Matter.Image[] = [];
    public starCount: number = 0;
    public ground?: Phaser.Physics.Matter.Image;
    public star_bg: Phaser.GameObjects.Image[] = [];
    public resetButton!: Phaser.GameObjects.Text;
    public infoPanel!: InfoPanel;

    preload ()
    {
        this.load.image('logo', 'assets/logo.png');
        this.load.image('buttonBG', 'assets/button-bg.png');
        this.load.image('buttonText', 'assets/button-text.png');
        this.load.image('sky', 'assets/sky.jpg');
        this.load.image('star', 'assets/star.png');
        this.load.image('star_bg', 'assets/star_bg.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('infoIcon', 'assets/info.png');
    }

    create ()
    {   

        //úvodní obrazovka
        this.add.image(400, 170, 'logo');
        const bg = this.add.image(0, 0, 'buttonBG').setInteractive();
        const text = this.add.image(0, 0, 'buttonText');

        //lesk pro bg
        if (bg.preFX) {
        const glowFX = bg.preFX.addGlow();
        }

        //button
        const container = this.add.container(400, 370, [ bg, text ]);

        //------------------------------

        // text (uprostřed nahoře)
        this.infoText = this.add.text(400, 35, '', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);


        //počítadlo hvězd
        this.starCounterText = this.add.text(10, 10, 'Hvězdy celkem: 0', {
            fontSize: '18px',
            color: '#ffffff'
        });
        this.starCounterText.setVisible(false);  // skrytý text při startu


        //reset počítadla
        this.resetButton = this.add.text(610, 10, 'Resetovat počet', {
            fontSize: '18px',
            color: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .setDepth(2)
        .setVisible(false)
        .on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
        event.stopPropagation();
            this.starCount = 0;
            this.starCounterText.setText('Hvězdy celkem: 0');
        })
        .on('pointerover', () => {
            this.resetButton.setStyle({
            color: '#000000',
            backgroundColor: '#ffffffff'
            });
        })
        .on('pointerout', () => {
            this.resetButton.setStyle({
            color: '#ffffffff',
            backgroundColor: '#000000'
            });
        });

        //ověří dostupnost fontu a vytvoří text na MAX počet
        document.fonts.load('96px "Luckiest Guy"').then(() => {
            this.celebrationText = this.add.text(400, 280, 'BIG WIN!', {
                fontFamily: 'Luckiest Guy',
                fontSize: '96px',
                color: '#c36a04ff',
                //fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setDepth(5);
         });   

         this.infoPanel = new InfoPanel(this);
        //------------------------------

        this.input.on('pointerdown', this.handleClick, this);
    }

    //metoda pro přidání hvězd a sčítání počtu
    public addStar(x?: number, y?: number) 
    {
        const posX = x ?? Phaser.Math.Between(50, 750);
        const posY = y ?? Phaser.Math.Between(-200, 200);

        const star = this.matter.add.image(posX, posY, 'star').setDepth(2);
        this.stars.push(star);

        this.starCount++;
        this.starCounterText.setText(`Hvězdy celkem: ${this.starCount}`);
    }

    //odebrání hvězd po každém kole
    public clearStars() 
    {
    this.stars.forEach(star => {
        if (star.body) {
            this.matter.world.remove(star.body);
        }
        star.destroy();
        });
    this.stars = [];
    }

    //fadein a fadeout pro info text
    public fadeText(newText: string) 
    {
        this.tweens.add({
            targets: this.infoText,
            alpha: 0,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.infoText.setText(newText);

                this.tweens.add({
                    targets: this.infoText,
                    alpha: 1,
                    duration: 500,
                    ease: 'Linear'
                });
            }
        });
    }

    // výherní text
    public showCelebration() 
    {
        this.isCelebrationActive = true;
        this.celebrationText.setAlpha(1).setVisible(true);

        this.tweens.add({
            targets: this.celebrationText,
            scale: { from: 1, to: 1.3 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        if (this.celebrationTimer) {
            this.celebrationTimer.remove();
        }

        // zmizí po 5 sekundách
        this.celebrationTimer = this.time.delayedCall(5000, () => {
            if (this.isCelebrationActive) {
            this.hideCelebration();
            }
        });
    }

    public hideCelebration() 
    {
        this.isCelebrationActive = false;

        this.tweens.killTweensOf(this.celebrationText);

        this.tweens.add({
            targets: this.celebrationText,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.celebrationText.setScale(1);
            }
        });
    }


    //spustí hru

    private handleClick() 
     {
        if (this.ground) {

            //zmizí big win
            if (this.isCelebrationActive) {
                if (this.celebrationTimer) {
                    this.celebrationTimer.remove();
                    this.celebrationTimer = undefined;
                }
                this.hideCelebration();
            }

            //zmizí zem
            this.tweens.add({
                targets: this.ground,
                alpha: 0,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.ground?.destroy();
                    this.ground = undefined;

                    this.fadeText('Klikni pro obnovení');
                }
            });
        } else {
            // Pokud zem neexistuje, spustí nové kolo
            LoadGame.run(this);
        }
    }


}
