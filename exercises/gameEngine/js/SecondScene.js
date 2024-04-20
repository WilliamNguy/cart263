class SecondScene extends Phaser.Scene {
    constructor() {
        super({ key: 'secondScene' });
    }

    create() {
        // Background
        const background = this.add.image(400, 300, 'background2');
        background.setOrigin(0.5, 0.5).setDisplaySize(800, 600);

        this.enemies = this.physics.add.group({
            key: 'enemy_handgun',
            repeat: 5,
        });
        this.enemies.children.iterate((enemy) => {
            const x = Phaser.Math.Between(50, 750); // Randomize x within the game width
            const y = Phaser.Math.Between(100, 500); // Randomize y within the specified range
            enemy.setPosition(x, y);
            enemy.setDisplaySize(25, 25);
            enemy.setCollideWorldBounds(true);
            enemy.setBounce(1);  // Make enemies bounce off boundaries
            this.randomizeEnemyMovement(enemy);  // Assign random initial movement
        });

        this.item2Group = this.physics.add.group({
            key: 'item2',
            repeat: 2
        });
        const marginTopBottom = 50;
        const usableHeight = 600 - (marginTopBottom * 2);
        this.item2Group.children.iterate((item, index) => {
            const x = 50;

            const y = marginTopBottom + 100 + (usableHeight / this.item2Group.children.size) * index;
            item.setPosition(x, y);
            item.setDisplaySize(25, 25);
            item.setCollideWorldBounds(true);
            item.setVelocityX(75); // Start moving right
            item.setBounce(1, 0); // Bounce only horizontally
        });
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.item2) {
                body.setVelocityX(body.velocity.x * - 1);
            }
        }, this);

        this.physics.world.setBoundsCollision(true, true, true, true); // Enable collision for all sides

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
            const y = Phaser.Math.Between(550, 600);
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

        this.isDragging = false;
        this.dragSensitivity = 20;  // Define a sensible default

        this.input.on('pointerdown', () => {
            this.game.canvas.requestPointerLock();
            this.isDragging = true;
        });

        // Move reticle with locked pointer
        this.input.on('pointerdown', (pointer) => {
            this.game.canvas.requestPointerLock();
            this.isDragging = true;  // Start dragging
        });

        this.input.on('pointerup', (pointer) => {
            this.isDragging = false;  // Stop dragging
        });

        this.input.on('pointermove', (pointer) => {
            if (this.input.mouse.locked) {
                this.reticle.x += pointer.movementX;
                this.reticle.y += pointer.movementY;
            }

            if (this.isDragging) {
                console.log('Dragging now');
                this.item1Group.children.iterate((item) => {
                    const distance = Phaser.Math.Distance.Between(this.reticle.x, this.reticle.y, item.x, item.y);
                    console.log('Distance to item: ', distance);  // Check the computed distance
                    if (distance <= this.dragSensitivity) {
                        const angle = Phaser.Math.Angle.Between(item.x, item.y, this.reticle.x, this.reticle.y);
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
    randomizeEnemyMovement(enemy) {
        enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
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
        this.enemies.children.iterate((enemy) => {
            // Check if any enemy reaches y=100 and reverse its vertical velocity
            if (enemy.y <= 100 && enemy.body.velocity.y < 0) {
                enemy.body.velocity.y *= -1;
            }
            if (enemy.y >= 500 && enemy.body.velocity.y > 0) {
                enemy.body.velocity.y *= -1;
            }
        });
        this.item1Group.children.iterate(function (item) {
            if (Phaser.Math.FloatBetween(0, 1) < 0.01) {  // Occasionally change direction
                item.setVelocity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(-10, 10));
            }
        });
    }

}