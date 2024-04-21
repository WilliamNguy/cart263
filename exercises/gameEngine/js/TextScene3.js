class TextScene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'textScene3' });
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000000');

        // Add the main description with word wrapping
        let mainText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Heavy metal contamination, such as mercury, poses a serious risk to marine environments. These contaminants build up in marine species, including sharks, which may result in health problems and higher death rates. Mercury is especially harmful, causing neurological and reproductive issues for marine creatures.', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Calculate the y position for the next text based on the main text height
        let nextTextY = mainText.y + mainText.height + 20;

        // Add additional mission instruction text below
        let missionText = this.add.text(this.cameras.main.centerX, nextTextY, 'Next mission: Collect all the thermometers before the shark gets you. (Use your gun to push back the shark)', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 760, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Calculate the y position for the "click to continue" text based on the mission text height
        let continueTextY = missionText.y + missionText.height + 20;

        // Add "click to continue" text below
        let continueText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Click to continue', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // Listen for any pointer down events
        this.input.on('pointerdown', () => {
            this.scene.start('thirdScene');
        });

    }
}