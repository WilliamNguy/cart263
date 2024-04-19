class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'boot'
        });
    }

    preload() {
        // Load in images and sprites
        this.load.spritesheet('player_handgun', 'assets/images/inflate.png',
            { frameWidth: 32, frameHeight: 32, endFrame: 19 }
        );
        this.load.spritesheet('enemy_handgun', 'assets/images/evil.png',
            { frameWidth: 32, frameHeight: 32, endFrame: 19 }
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
        this.load.image('item1', 'assets/images/bottle.png');
        this.load.image('item2', 'assets/images/fish.png');
        this.load.once('complete', () => {
            this.scene.start('example');
        });


    }

    create() {

    }

    update() {

    }
}