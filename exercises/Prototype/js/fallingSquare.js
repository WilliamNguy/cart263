class FallingSquare {
    constructor() {
        this.row = 0;
        this.col = Math.floor(random(world[0].length));
        this.speed = 0.05;
    }

    update() {
        this.row += this.speed;
        if (this.row >= world.length) {
            this.row = 0;
            this.col = Math.floor(random(world[0].length));
        }
    }

    display() {
        let x = this.col * TILE_SIZE;
        let y = this.row * TILE_SIZE;
        push();
        fill(32, 194, 14);
        rect(x, y, TILE_SIZE);
        pop();
    }
}

