class FailedScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'failedScene2' });
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000000');

        let mainText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'YOU ARE', {
            fontSize: '40px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        let nextTextY = mainText.y + mainText.height + 20;

        let missionText = this.add.text(this.cameras.main.centerX, nextTextY, 'FIRED!!', {
            fontSize: '40px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        let continueTextY = missionText.y + missionText.height + 20;

        let continueText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Refresh the page and restart', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);


    }
}