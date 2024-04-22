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
    item1Copies;
    item1Hits = 0;


    create() {
        // Set world bounds
        this.physics.world.setBounds(100, 275, 1600, 920);


        this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        // Add background player, enemy, reticle, healthpoint sprites
        const background = this.add.image(900, 600, 'background');
        this.player = this.physics.add.sprite(800, 600, 'player_handgun');
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


        this.item1Copies = this.add.group(); // Group for item1 copies


        let x = Phaser.Math.Between(100, 1620);
        let y = Phaser.Math.Between(275, 940);
        this.item1 = this.physics.add.sprite(x, y, 'item1')
        this.item1.setDisplaySize(48, 48);
        this.item1.setCollideWorldBounds(true);


        this.item2 = this.physics.add.group({
            key: 'item2',
            quantity: 32,
            bounceX: 0.5,
            bounceY: 0.5,
            collideWorldBounds: true,
            dragX: 50,
            dragY: 5
        });

        this.item2.children.iterate(item => {
            item.setDisplaySize(75, 75);
        });

        Phaser.Actions.RandomRectangle(this.item2.getChildren(), this.physics.world.bounds);

        this.physics.add.overlap(this.playerBullets, this.item1, this.recycled, null, this);
        this.physics.add.collider(this.player, this.item2);

        this.enemy = this.physics.add.sprite(300, 600, 'enemy_handgun');
        this.anims.create({
            key: 'inflate-move',
            frames: this.anims.generateFrameNumbers('enemy_handgun', {
                start: 0,
                end: 19
            }),
            frameRate: 6,
            repeat: -1
        },);

        this.enemy.play('inflate-move');

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
            quantity: 60

        });

        this.crates.children.each(function (crate) {
            const x = Phaser.Math.Between(130, 1620);
            const y = Phaser.Math.Between(295, 1150);
            crate.setPosition(x, y);
            crate.setDisplaySize(64, 64);
            crate.play('crate-moving');
        }, this);

        this.crates.children.iterate(crate => {
            crate.setDisplaySize(64, 64);
        });



        this.physics.add.collider(this.player, this.crates);
        this.physics.add.collider(this.player, this.crates);
        this.physics.add.collider(this.item2, this.crates, (item, crate) => {
        });
        this.physics.add.collider(this.item2, this.crate, (item, crate) => {

        });
        this.physics.add.collider(this.playerBullets, this.crates, (bullet, crate) => {
            bullet.destroy(); // Destroy bullet when collisioning with crate
        });

        let hitCount = 0; // Track the number of hits

        this.physics.add.overlap(this.playerBullets, this.item1, (bullet, item1) => {
            const newItem1 = this.add.sprite(50 + hitCount * 160, 0, 'item1');
            hitCount++; //hit count
        });

        this.reticle = this.physics.add.sprite(800, 700, 'target');

        // Set image/sprite properties
        background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
        this.player.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(500, 500);
        this.enemy.setOrigin(0.5, 0.5).setDisplaySize(96, 96).setCollideWorldBounds(true);
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

        const text = this.add.text(150, -30, 'Find and eliminate 10 plastic bottles by shooting them', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' });

        this.add.text(200, 1220, 'Click to shoot', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(600, 1220, 'Spacebar to jump/dash', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(1000, 1220, 'ASDW to move', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
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

        this.item2.getChildren().forEach(item => {
            if (Phaser.Math.Between(0, 100) < 2) { // 2% chance to change direction
                const angle = Phaser.Math.Between(0, 360); // Random angle in degrees
                const speed = Phaser.Math.Between(50, 100); // Random speed
                this.physics.velocityFromAngle(angle, speed, item.body.velocity);
            }
        });

        if (Phaser.Math.Between(0, 100) < 2) { // 2% chance to change direction
            const angle = Phaser.Math.Between(0, 360); // Random angle in degrees
            const speed = Phaser.Math.Between(50, 100); // Random speed
            this.physics.velocityFromAngle(angle, speed, this.item1.body.velocity);
        }

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
            const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);
            const distance = 140;
            const x = this.player.x + Math.cos(angle) * distance;
            const y = this.player.y + Math.sin(angle) * distance;

            this.player.setPosition(x, y);
        }

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

                this.player.setPosition(1620, Phaser.Math.Between(275, 940));
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

            // if (bullet) {
            //     bullet.fire(this.enemy, this.player);

            //     // Add collider between bullet and player
            //     this.physics.add.collider(this.player, bullet, (playerHit, bulletHit) => this.playerHitCallback(playerHit, bulletHit));
            // }
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

        // Display a copy of item1 at the top left of the screen
        const copy = this.add.image(200, 75, 'item1').setOrigin(0, 0).setDisplaySize(75, 75);
        this.item1Copies.add(copy);

        // Position the copies next to each other
        this.item1Copies.children.iterate((child, index) => {
            child.x = index * 75; // Assuming 50 is the width of each copy
        });

        // End the game if 10 item1 have been hit
        this.item1Hits++;
        if (this.item1Hits >= 10) {
            this.endGame();
        }
    }

    endGame() {
        // Transition to another scene instead of showing an end screen
        this.scene.start('textScene2');
    }


}

