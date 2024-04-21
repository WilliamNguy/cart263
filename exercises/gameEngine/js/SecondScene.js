class SecondScene extends Phaser.Scene {
    constructor() {
        super({ key: 'secondScene' });
        this.dolphin = null;  // Define the dolphin as a class property

    }

    create() {
        // Background
        const background = this.add.image(400, 300, 'background2');
        background.setOrigin(0.5, 0.5).setDisplaySize(800, 600);

        this.anims.create({
            key: 'dolphin-moving',
            frames: this.anims.generateFrameNumbers('dolphin', {
                start: 0,
                end: 10
            }),
            frameRate: 8,
            repeat: -1
        },);

        this.anims.create({
            key: 'turtle-moving',
            frames: this.anims.generateFrameNumbers('turtle', {
                start: 0,
                end: 10
            }),
            frameRate: 8,
            repeat: -1
        },);

        this.anims.create({
            key: 'straw-moving',
            frames: this.anims.generateFrameNumbers('straw', {
                start: 0,
                end: 10
            }),
            frameRate: 8,
            repeat: -1
        },);

        this.enemies = this.physics.add.group({
            key: 'turlte',
            repeat: 5,
        });
        this.enemies.children.iterate((enemy) => {
            const x = Phaser.Math.Between(50, 750); // Randomize x within the game width
            const y = Phaser.Math.Between(100, 500); // Randomize y within the specified range
            enemy.setPosition(x, y);
            enemy.setDisplaySize(25, 25);
            enemy.setCollideWorldBounds(true);
            enemy.setBounce(1);  // Make enemies bounce off boundaries
            enemy.play('turtle-moving');
            this.randomizeEnemyMovement(enemy);  // Assign random initial movement

            enemy.rotation = Phaser.Math.FloatBetween(0, 2 * Math.PI);

        });





        this.item2Group = this.physics.add.group({
            key: 'dolphin',
            repeat: 2
        });
        const marginTopBottom = 50;
        const usableHeight = 600 - (marginTopBottom * 2);
        this.item2Group.children.iterate((item, index) => {
            const x = 50;
            const y = Phaser.Math.Between(100, 500); // Ensuring Y is always below 600 and above 100
            item.setPosition(x, y);
            item.setDisplaySize(100, 50);
            item.setCollideWorldBounds(true);
            item.setVelocityX(75); // Start moving right
            item.setBounce(1, 1); // Bounce only horizontally
            item.play('dolphin-moving');
            this.randomizeDolphinMovement(item);


            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.item2Group.children.iterate(this.randomizeDolphinMovement, this);
                },
                loop: true
            });

        });
        this.physics.add.overlap(this.item2Group, this.item1Group, this.handleDolphinItemCollision, null, this);


        this.physics.world.on('worldbounds', (body) => {
            if (this.item2Group.contains(body.gameObject)) {
                // Flip the dolphin when it hits the world bounds
                body.gameObject.setFlipX(body.velocity.x < 0);
            }
        });



        this.physics.world.setBoundsCollision(true, true, true, true); // Enable collision for all sides

        // Player
        this.player = this.physics.add.sprite(365, 60, 'player_handgun');
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
            key: 'straw',
            repeat: 5,
        });
        this.item1Group.children.iterate(function (item) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(575, 600);
            item.setPosition(x, y);
            item.setDisplaySize(45, 45);
            item.setCollideWorldBounds(true);
            item.setBounce(1);
            item.play('straw-moving');

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
        this.physics.add.collider(this.player, this.item2Group, this.playerHitsDolphin, null, this);
        this.physics.add.collider(this.item1Group, this.item2Group, this.item1HitsDolphin, null, this);
        this.physics.add.overlap(this.item1Group, this.handleCollision, null, this);
        this.physics.add.collider(this.enemies, this.item1Group, this.handleEnemyItemCollision, null, this);





    }


    randomizeDolphinMovement(dolphin) {
        const speed = Phaser.Math.Between(50, 150); // Random speed
        const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI); // Random angle
        dolphin.setVelocityX(Math.cos(angle) * speed);
        dolphin.setVelocityY(Math.sin(angle) * speed);
        dolphin.rotation = angle; // Optionally set rotation to face the movement direction
    }

    item1HitsDolphin(item1, dolphin) {
        // Handle what happens when an item1 collides with a dolphin
        console.log('straw has collided with a dolphin!');

        // Example actions to take on collision
        dolphin.disableBody(true, true);  // This will disable and hide the dolphin
        // Optionally, you could also disable the item1 if needed
        // item1.disableBody(true, true);
    }

    flipAndRotateDolphin(reset = false) {
        if (!this.dolphin || !this.dolphin.body) return; // Safety check to ensure dolphin exists

        this.dolphin.setVelocityX(-this.dolphin.body.velocity.x); // Reverse velocity
        this.dolphin.setFlipX(this.dolphin.body.velocity.x < 0); // Flip based on direction

        // Remove any existing tweens to prevent conflicts
        this.tweens.killTweensOf(this.dolphin);

        // Create a new tween to rotate the dolphin
        this.tweens.add({
            targets: this.dolphin,
            angle: reset ? 0 : 180, // Rotate to 180 degrees or reset to 0
            duration: 500, // Animation duration in milliseconds
            ease: 'Sine.easeInOut'
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
    handleCollision(turtle, item1) {
        turtle.disableBody(true, true); // Disables and hides the turtle
    }
    collectItem1(player, item1) {
        item1.disableBody(true, true);
    }
    randomizeEnemyMovement(enemy) {
        enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    }

    handleEnemyItemCollision(enemy, item) {
        console.log('An enemy has collided with item1!');
        // Add any specific logic here, for example:
        enemy.disableBody(true, true); // This will disable and hide the enemy
        item.disableBody(true, true);  // This could also disable and hide the item
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

        this.item2Group.children.iterate((dolphin) => {
            // Restrict dolphins to the specified y range
            if (dolphin.y < 100) {
                dolphin.y = 100;
                dolphin.setVelocityY(Math.abs(dolphin.body.velocity.y)); // Ensure positive velocity downwards
            } else if (dolphin.y > 500) {
                dolphin.y = 500;
                dolphin.setVelocityY(-Math.abs(dolphin.body.velocity.y)); // Ensure negative velocity upwards
            }
        });
    }

}