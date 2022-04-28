// GAME SETTINGS
// We may need to use the Physics library in Phaser in order to dynamically create and destroy objects (music notes)

let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 800,
    // physics: {
    //     default: "arcade",
    //     arcade: {
    //         debug: false // set to true to see box colliders
    //     }
    // },
    scene: [
        Menu,
        Instructions,
        Play,
    ]
}

let game = new Phaser.Game(config);

let keyUp, keyDn, keyLt, keyRt; // reserve movement keys

let keySPACE; // reserve for start

// DEBUGGING PICKS
// this.guitarPick2 = this.add.sprite(this.guitarPickX, this.rowPos[1], 'guitar-pick').setOrigin(0.5, 0.5);
// this.guitarPick3 = this.add.sprite(this.guitarPickX, this.rowPos[2], 'guitar-pick').setOrigin(0.5, 0.5);
// this.guitarPick4 = this.add.sprite(this.guitarPickX, this.rowPos[3], 'guitar-pick').setOrigin(0.5, 0.5);