// GAME SETTINGS
// We may need to use the Physics library in Phaser in order to dynamically create and destroy objects (music notes)

let config = {
    width: 1280,
    height: 800,
    // physics: {
    //     default: "arcade",
    //     arcade: {
    //         debug: false // set to true to see box colliders
    //     }
    // },
    scene: [
        Play
    ]
}

let game = new Phaser.Game(config);

let keyUP, keyDOWN; // reserve move up and down keys (subject to change)