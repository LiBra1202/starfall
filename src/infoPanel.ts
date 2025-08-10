import Phaser from 'phaser';

export class InfoPanel {
    private scene: Phaser.Scene;
    private icon: Phaser.GameObjects.Image;
    private text: Phaser.GameObjects.Text;
    private visible: boolean = false;

    constructor(scene: Phaser.Scene) 
    {
        this.scene = scene;

        // ikonka
        this.icon = scene.add.image(45, 555, 'infoIcon')
            .setInteractive()
            .setScale(0.5)
            .setDepth(1000) 
            .setScrollFactor(0)
            .setOrigin(0.5);

        this.text = scene.add.text(400, 300,
`PRAVIDLA HRY STARFALL:

- Klikni pro spuštění hvězd
- Klikni znovu, a zem s hvězdami zmizí
- Tlačítkem můžeš vynulovat celkový počet hvězd
- Pokud se objeví 15 hvězd, máš štěstí a jsi vítěz!`,
        {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 30, y: 30 },
            align: 'left',
            wordWrap: { width: 500 }
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setDepth(999) 
        .setVisible(false)
        this.text.setInteractive();

        // kliknutí na ikonku zobrazí a skryje pravidla
        this.icon.on('pointerdown', (
            _pointer: Phaser.Input.Pointer, 
            _localX: number, 
            _localY: number, 
            event: Phaser.Types.Input.EventData
            ) => {
                event.stopPropagation();
                this.toggle();
            });

        // kliknutí na text skryje pravidla
        this.text.on('pointerdown', (
            _pointer: Phaser.Input.Pointer, 
            _localX: number, 
            _localY: number, 
            event: Phaser.Types.Input.EventData
            ) => {
                event.stopPropagation();
                this.toggle();
            });    
    }

    //po kliknutí
    private toggle() 
    {
        this.visible = !this.visible;
        this.text.setVisible(true);

        this.scene.tweens.add({
            targets: this.text,
            alpha: this.visible ? 1 : 0,
            duration: 300,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (!this.visible) {
                    this.text.setVisible(false);
                }
            }
        });
    }
}
