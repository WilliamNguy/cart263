
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Boot, TextScene1, Example, TextScene2, FailedScene2, SecondScene, TextScene3, ThirdScene, VictoryScreen]
};

const game = new Phaser.Game(config);