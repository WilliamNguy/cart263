class Wave extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'wave');
        this.speed = 0.5;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
        this.scene.add.existing(this); // Add the sprite to the scene
    }

    fire(shooter, target, speed = 1) {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y) {
            this.xSpeed = speed * Math.sin(this.direction);
            this.ySpeed = speed * Math.cos(this.direction);
        }
        else {
            this.xSpeed = -speed * Math.sin(this.direction);
            this.ySpeed = -speed * Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
        this.play('wave-moving');

    }

    update(time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}