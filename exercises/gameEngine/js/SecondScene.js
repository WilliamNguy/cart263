class SecondScene extends Phaser.Scene {
    constructor() {
        super({ key: 'secondScene' });
    }

    create() {
        // Background
        const background = this.add.image(400, 300, 'background');
        background.setOrigin(0.5, 0.5).setDisplaySize(800, 600);



        // Player
        this.player = this.physics.add.sprite(400, 300, 'player_handgun');
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'inflate-moving',
            frames: this.anims.generateFrameNumbers('player_handgun', {
                start: 0,
                end: 19
            }),
            frameRate: 9,
            repeat: -1
        },);

        this.player.play('inflate-moving');

        this.item1Group = this.physics.add.group({
            key: 'item1',
            repeat: 5,
        });

        this.item1Group.children.iterate(function (item) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(50, 550);
            item.setPosition(x, y);
            item.setDisplaySize(25, 25);
            item.setCollideWorldBounds(true);
            item.setBounce(1);
        });

        this.physics.add.overlap(this.player, this.item1Group, this.collectItem1, null, this);

        // Bullets
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        // Movement Keys
        this.moveKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Pointer Lock for Mouse Control
        this.input.on('pointerdown', () => {
            this.game.canvas.requestPointerLock();
        });

        // Set camera properties
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player);

        // Text for scene information
        this.add.text(400, 550, 'Second Scene: Shoot targets!', { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

        this.reticle = this.physics.add.sprite(400, 300, 'target');
        this.reticle.setDisplaySize(10, 10);
        this.reticle.setCollideWorldBounds(true);

        // Set up the camera to follow the player
        this.cameras.main.startFollow(this.player);
        // Lock pointer on game canvas click
        this.input.on('pointerdown', () => {
            this.game.canvas.requestPointerLock();
        });

        // Move reticle with locked pointer
        this.input.on('pointermove', (pointer) => {
            if (this.input.mouse.locked) {
                this.reticle.x += pointer.movementX;
                this.reticle.y += pointer.movementY;
            }
        });

        this.input.on('pointerdown', (pointer) => {
            this.isDragging = true;
        });

        this.input.on('pointerup', (pointer) => {
            this.isDragging = false;
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                this.item1Group.children.iterate((item) => {
                    if (item.active) {
                        const angle = Phaser.Math.Angle.Between(item.x, item.y, this.player.x, this.player.y);
                        item.setVelocity(Math.cos(angle) * 50, Math.sin(angle) * 50);
                    }
                });
            }
        });
    }

    pointermoveHandler(pointer) {
        if (!this.isDragging) return;

        this.item1Group.children.iterate((item) => {
            const dx = this.player.x - item.x;
            const dy = this.player.y - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            item.body.setVelocity(dx / distance * 100, dy / distance * 100);
        });
    }

    collectItem1(player, item1) {
        item1.disableBody(true, true);
    }

    update() {
        this.player.body.setVelocity(0);

        if (this.moveKeys.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.moveKeys.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.moveKeys.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.moveKeys.down.isDown) {
            this.player.setVelocityY(160);
        }
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);
        if (this.player.x <= this.player.width / 2) {
            this.scene.start('thirdScene');  // Transition to ThirdScene
        }
        this.item1Group.children.iterate(function (item) {
            // Example: Randomly adjust velocity
            if (Phaser.Math.FloatBetween(0, 1) < 0.01) {  // Occasionally change direction
                item.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
            }
        });
    }

}