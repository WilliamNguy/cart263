class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'boot'
        });
    }

    preload() {
        // Load in images and sprites
        this.load.spritesheet('player_handgun', 'assets/images/player.png',
            { frameWidth: 800, frameHeight: 600 }
        );
        this.load.image('bullet', 'assets/images/laser.png');
        this.load.image('target', 'assets/images/mouse.png');
        this.load.image('background', 'assets/images/ocean.jpeg');
        this.load.spritesheet('crate', 'assets/images/crate.png',
            {
                frameWidth: 32,
                frameHeight: 32,
                endFrame: 11
            }
        );
        this.load.once('complete', () => {
            this.scene.start('example');
        });

    }

    create() {

    }

    update() {

    }
}