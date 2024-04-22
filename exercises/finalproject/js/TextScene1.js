class TextScene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'textScene1' });
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000000');

        let mainText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Ocean pollution is a grave environmental concern that severely impacts marine ecosystems, endangers wildlife, and disrupts natural habitats. It is estimated that approximately 8 million metric tons of plastic waste, including water bottles, are discarded into the oceans each year.', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        let nextTextY = mainText.y + mainText.height + 20;

        let missionText = this.add.text(this.cameras.main.centerX, nextTextY, 'Mission : Get rid of the bottle using your laser gun to disintegrate them. ', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        let continueTextY = missionText.y + missionText.height + 20;

        let optionalText = this.add.text(this.cameras.main.centerX, continueTextY, 'Your supervisor is there, so be professional', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        let addTextY = optionalText.y + optionalText.height + 20;

        let addText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Click to continue', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.start('example');
        });

    }
}