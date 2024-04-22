class TextScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'textScene2' });
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000000');

        let mainText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'It is estimated that annually, between 437 million and 8.3 billion plastic straws accumulate along coastlines worldwide. This underscores the considerable role plastic straws play in contributing to marine pollution.', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        let nextTextY = mainText.y + mainText.height + 20;

        let missionText = this.add.text(this.cameras.main.centerX, nextTextY, 'Next mission: You must use your gravity gun (Click and Hold to use) to pull in all the plastic straws and cups. Avoid letting marine life touch it or else you are fired!', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        let continueTextY = missionText.y + missionText.height + 20;

        let continueText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Click to continue', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.start('secondScene');
        });

    }
}