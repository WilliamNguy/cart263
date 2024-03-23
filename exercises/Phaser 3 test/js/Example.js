class Example extends Phaser.Scene {
    constructor() {
        super({
            key: 'example'
        });
    }

    time = 0;
    enemyBullets;
    playerBullets;
    moveKeys;
    reticle;
    healthpoints;
    player;
    enemy;
    crate;
    hp1;
    hp2;
    hp3;


    create() {
        // Set world bounds
        this.physics.world.setBounds(100, 275, 1620, 940);

        // Add 2 groups for Bullet objects
        this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        // Add background player, enemy, reticle, healthpoint sprites
        const background = this.add.image(900, 600, 'background');
        this.player = this.physics.add.sprite(800, 600, 'player_handgun');
        this.player.setCollideWorldBounds(true);

        let x = Phaser.Math.Between(100, 1620);
        let y = Phaser.Math.Between(275, 940);
        this.item1 = this.physics.add.sprite(x, y, 'item1')

        this.item2 = this.physics.add.group({
            key: 'item2',
            quantity: 12,
            bounceX: 0.5,
            bounceY: 0.5,
            collideWorldBounds: true,
            dragX: 50,
            dragY: 5
        });
        Phaser.Actions.RandomRectangle(this.item2.getChildren(), this.physics.world.bounds);

        this.physics.add.overlap(this.playerBullets, this.item1, this.recycled, null, this);
        this.physics.add.collider(this.player, this.item2);

        this.enemy = this.physics.add.sprite(300, 600, 'player_handgun');
        this.reticle = this.physics.add.sprite(800, 700, 'target');
        this.hp1 = this.add.image(-200, 10, 'target').setScrollFactor(0.5, 0.5);
        this.hp2 = this.add.image(-150, 10, 'target').setScrollFactor(0.5, 0.5);
        this.hp3 = this.add.image(-100, 10, 'target').setScrollFactor(0.5, 0.5);
        this.crate = this.physics.add.sprite(400, 1000, 'crate');
        this.crate.setCollideWorldBounds(true);
        this.crate.setImmovable(true);
        this.crate.setDisplaySize(64, 64);

        this.anims.create({
            key: 'crate-moving',
            frames: this.anims.generateFrameNumbers('crate', {
                start: 0,
                end: 11
            }),
            frameRate: 4,
            repeat: -1
        },);

        this.crate.play('crate-moving');

        this.crates = this.physics.add.group({
            key: 'crate',
            immovable: true,
            quantity: 12
        });

        this.crates.children.each(function (crate) {
            const x = Phaser.Math.Between(130, 1620); // Random x position between 100 and 1620
            const y = Phaser.Math.Between(295, 1200);
            crate.setPosition(x, y);
            crate.setDisplaySize(64, 64);
            crate.play('crate-moving');
        }, this);

        this.crates.children.iterate(crate => {
            crate.setDisplaySize(64, 64); // Set the desired width and height
        });



        this.physics.add.collider(this.player, this.crates);
        this.physics.add.collider(this.player, this.crates);
        this.physics.add.collider(this.item2, this.crates, (item, crate) => {
        });
        this.physics.add.collider(this.item2, this.crate, (item, crate) => {
            // Add bounce effect here if needed
        });
        this.physics.add.collider(this.playerBullets, this.crates, (bullet, crate) => {
            bullet.destroy(); // Destroy bullet upon collision with crate
        });

        let hitCount = 0; // Track the number of hits

        this.physics.add.overlap(this.playerBullets, this.item1, (bullet, item1) => {
            const newItem1 = this.add.sprite(50 + hitCount * 160, 0, 'item1'); // Create a new sprite at the top left corner
            newItem1.setOrigin(0, 0);
            hitCount++; // Increment hit count
        });

        // Set image/sprite properties
        background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
        this.player.setOrigin(0.5, 0.5).setDisplaySize(66, 60).setCollideWorldBounds(true).setDrag(500, 500);
        this.enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
        this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
        this.hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        this.hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        this.hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

        // Set sprite variables
        this.player.health = 3;
        this.enemy.health = 3;
        this.enemy.lastFired = 0;

        // Set camera properties
        this.cameras.main.zoom = 0.465;
        this.cameras.main.scrollX += 500;
        this.cameras.main.scrollY += 300;

        // this.cameras.main.startFollow(this.player);

        // Creates object for input with WASD kets
        this.moveKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Fires bullet from player on left click of mouse
        this.input.on('pointerdown', (pointer, time, lastFired) => {
            if (this.player.active === false) { return; }

            // Get bullet from bullets group
            const bullet = this.playerBullets.get().setActive(true).setVisible(true).setDisplaySize(45, 45);

            if (bullet) {
                bullet.fire(this.player, this.reticle);
                this.physics.add.collider(this.enemy, bullet, (enemyHit, bulletHit) => this.enemyHitCallback(enemyHit, bulletHit));
            }
        });

        // Pointer lock will only work after mousedown
        game.canvas.addEventListener('mousedown', () => {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        this.input.keyboard.on('keydown_Q', event => {
            if (game.input.mouse.locked) { game.input.mouse.releasePointerLock(); }
        }, 0);

        // Move reticle upon locked pointer move
        this.input.on('pointermove', pointer => {
            if (this.input.mouse.locked) {
                this.reticle.x += pointer.movementX;
                this.reticle.y += pointer.movementY;
            }
        });

    }

    update(time, delta) {
        this.player.body.setVelocity(0);

        if (this.moveKeys.left.isDown) {
            this.player.body.setVelocityX(-400);
        }
        else if (this.moveKeys.right.isDown) {
            this.player.body.setVelocityX(400);
        }

        if (this.moveKeys.up.isDown) {
            this.player.body.setVelocityY(-400);
        }
        else if (this.moveKeys.down.isDown) {
            this.player.body.setVelocityY(400);
        }
        // Rotates player to face towards reticle
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

        // Rotates enemy to face towards player
        this.enemy.rotation = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);

        // Make reticle move with player
        this.reticle.body.velocity.x = this.player.body.velocity.x;
        this.reticle.body.velocity.y = this.player.body.velocity.y;

        // Constrain velocity of player
        this.constrainVelocity(this.player, 500);

        // Constrain position of constrainReticle
        this.constrainReticle(this.reticle);

        // Make enemy fire
        this.enemyFire(time);
    }

    enemyHitCallback(enemyHit, bulletHit) {
        // Reduce health of enemy
        if (bulletHit.active === true && enemyHit.active === true) {
            enemyHit.health = enemyHit.health - 1;
            console.log('Enemy hp: ', enemyHit.health);

            // Kill enemy if health <= 0
            if (enemyHit.health <= 0) {
                enemyHit.setActive(false).setVisible(false);
            }

            // Destroy bullet
            bulletHit.setActive(false).setVisible(false);
        }
    }

    playerHitCallback(playerHit, bulletHit) {
        // Reduce health of player
        if (bulletHit.active === true && playerHit.active === true) {
            playerHit.health = playerHit.health - 1;
            console.log('Player hp: ', playerHit.health);

            // Kill hp sprites and kill player if health <= 0
            if (playerHit.health === 2) {
                this.hp3.destroy();
            }
            else if (playerHit.health === 1) {
                this.hp2.destroy();
            }
            else {
                this.hp1.destroy();

                // Game over state should execute here
            }

            // Destroy bullet
            bulletHit.setActive(false).setVisible(false);
        }
    }

    enemyFire(time) {
        if (this.enemy.active === false) {
            return;
        }

        if ((time - this.enemy.lastFired) > 1000) {
            this.enemy.lastFired = time;

            // Get bullet from bullets group
            const bullet = this.enemyBullets.get().setActive(true).setVisible(true).setDisplaySize(45, 45);

            if (bullet) {
                bullet.fire(this.enemy, this.player);

                // Add collider between bullet and player
                this.physics.add.collider(this.player, bullet, (playerHit, bulletHit) => this.playerHitCallback(playerHit, bulletHit));
            }
        }
    }

    constrainVelocity(sprite, maxVelocity) {
        if (!sprite || !sprite.body) { return; }

        let angle, currVelocitySqr, vx, vy;
        vx = sprite.body.velocity.x;
        vy = sprite.body.velocity.y;
        currVelocitySqr = vx * vx + vy * vy;

        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            sprite.body.velocity.x = vx;
            sprite.body.velocity.y = vy;
        }
    }

    constrainReticle(reticle) {
        const distX = reticle.x - this.player.x; // X distance between player & reticle
        const distY = reticle.y - this.player.y; // Y distance between player & reticle

        // Ensures reticle cannot be moved offscreen (player follow)
        if (distX > 800) { reticle.x = this.player.x + 800; }
        else if (distX < -800) { reticle.x = this.player.x - 800; }

        if (distY > 600) { reticle.y = this.player.y + 600; }
        else if (distY < -600) { reticle.y = this.player.y - 600; }
    }

    recycled(playerBullets, item1) {
        let x = Phaser.Math.Between(100, 1620);
        let y = Phaser.Math.Between(275, 940);
        this.item1.setPosition(x, y);
    }

}

