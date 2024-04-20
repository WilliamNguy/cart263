class ThirdScene extends Phaser.Scene {
    constructor() {
        super({ key: 'thirdScene' });
    }

    create() {

        this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        // Background
        const background = this.add.image(400, 300, 'background3');
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


        this.enemy = this.physics.add.sprite(50, 300, 'shark'); // Spawns on the left side, vertically centered
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setDisplaySize(100, 50);
        this.enemy.setVelocity(0);
        this.physics.add.collider(this.player, this.enemy);
        this.anims.create({
            key: 'shark-moving',
            frames: this.anims.generateFrameNumbers('shark', {
                start: 0,
                end: 10
            }),
            frameRate: 8,
            repeat: -1
        },);
        this.enemy.play('shark-moving');

        // Movement Keys
        this.moveKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.input.on('pointerdown', (pointer, time, lastFired) => {
            if (this.player.active === false) { return; }

            // Get bullet from bullets group
            const bullet = this.playerBullets.get().setActive(true).setVisible(true).setDisplaySize(45, 45);

            if (bullet) {
                bullet.fire(this.player, this.reticle);
                // this.physics.add.collider(this.enemy, bullet, (enemyHit, bulletHit) => this.enemyHitCallback(enemyHit, bulletHit));
            }
        });

        // Pointer Lock for Mouse Control
        this.input.on('pointerdown', () => {
            this.game.canvas.requestPointerLock();
        });

        // Set camera properties
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player);

        // Text for scene information
        this.add.text(400, 550, 'Third Scene: Shoot targets!', { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

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
        //collision between bullet and enemy
        this.physics.add.collider(this.playerBullets, this.enemy, this.bulletHitsEnemy, null, this);

    }

    bulletHitsEnemy(enemy, bullet) {
        if (!bullet.active || !enemy.active) return;

        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.destroy();
        //Distance between bullet adn enemy
        const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, enemy.x, enemy.y);

        // Pushes the enemy back 
        enemy.x += Math.cos(angle) * 35;
        enemy.y += Math.sin(angle) * 35;

    }

    fireBullet() {
        const bullet = this.playerBullets.get(true, this.player.x, this.player.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);
            bullet.setRotation(angle);
            this.physics.velocityFromRotation(angle, 400, bullet.body.velocity);
        }
    }




    update() {

        this.physics.world.collide(this.playerBullets, this.enemy, this.bulletHitsEnemy, null, this);


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

        this.adjustEnemyMovement();

    }

    adjustEnemyMovement() {
        var angle = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);

        this.enemy.setVelocityX(Math.cos(angle) * 50);
        this.enemy.setVelocityY(Math.sin(angle) * 50);

        this.enemy.rotation = angle;
    }
}