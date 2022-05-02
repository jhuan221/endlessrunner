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
        Play
    ]
}

let game = new Phaser.Game(config);

let keyUp, keyDn, keyLt, keyRt, keySp, keyM, keyR; // reserve movement keys

let keySPACE; // reserve for start


// DEBUGGING PICKS
// this.guitarPick2 = this.add.sprite(this.guitarPickX, this.rowPos[1], 'guitar-pick').setOrigin(0.5, 0.5);
// this.guitarPick3 = this.add.sprite(this.guitarPickX, this.rowPos[2], 'guitar-pick').setOrigin(0.5, 0.5);
// this.guitarPick4 = this.add.sprite(this.guitarPickX, this.rowPos[3], 'guitar-pick').setOrigin(0.5, 0.5);

/*
    Endless Strummer
    Joshua Meyers, Jessica Huang, Justin Murillo, Yicheng Xiang
    May 2 2022

    For our creative tilt, we thought of experimenting with the music and incorporating it with 
    the mechanics we have implemented. For example, when pick collect a bad note, 
    a bad sound would play and a good note would have a good sound. Once a player has collected 
    a certain amount of either notes, it would play its respective tune. Additionally, 
    we added power-ups such as shooter, where a player can shoot bad/good notes, double speed, the pace 
    of the game speeds up for a time period, and shield, a player does not decrease their cheer bar
    if they hit a bad note. To emulate strumming a guitar, we have the guitar pick move in all four directions 
    from string to string, with the orientation of the pick facing down.
*/