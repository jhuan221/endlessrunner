let config = {
    width: 1280,
    height: 800,
    physics: {
        default: "arcade",
        arcade: {
            debug: false // set to true to see box colliders
        }
    }
}

let game = new Phaser.Game(config);