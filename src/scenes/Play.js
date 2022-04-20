// Main Play Scene

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.lastRow = -1; // to track last row assignment
        this.noteCount = 12; // number of notes to spawn on screen
        this.noteSize = 50; // pixel size of each note
        this.rowPos = [
            (2.5*game.config.height)/8, // String 1 (TOP)
            (3.5*game.config.height)/8, // String 2
            (4.5*game.config.height)/8, // String 3
            (5.5*game.config.height)/8  // String 4
        ];
        this.scrollSpeed = 1; // scrolling speed
        this.spacingX = 120; // spacing between notes
    }

    preload() {
        this.load.image('guitar-body', './assets/test-guitar-body.png'); // 'GUITAR BODY' W: 741 px, H: 741 px
        this.load.image('guitar-neck', './assets/test-guitar-neck.png'); // 'GUITAR NECK' W: 1200 px, H: 370 px, fret spacing: 150 px
        this.load.image('guitar-pick', './assets/test-guitar-pick.png'); // 'GUITAR PICK' W: 50 px, H: 50px
    }

    create() {
        this.guitarBodyBig = this.add.sprite(game.config.width/2, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position behind guitar neck
        this.guitarNeck = this.add.tileSprite(0, game.config.height/2, 1280, 370, 'guitar-neck').setOrigin(0, 0.5); // guitar neck is the main scrolling tileSprite
        this.guitarBodySmall = this.add.sprite((3*game.config.width)/10, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position in front of guitar neck
        this.guitarBodyBig.setScale(2, 1.25); // (W, H) scaled to be larger than guitarBodySmall
        this.guitarBodySmall.setScale(1.25, 1); // (W, H) scaled to cover guitar neck


        // guitar picks are displayed to experiment with string (lane) spacing
        this.guitarPick1 = this.add.sprite(game.config.width/3, this.rowPos[0], 'guitar-pick').setOrigin(0.5, 0.5); // String 1 (TOP)
        this.guitarPick2 = this.add.sprite(game.config.width/3, this.rowPos[1], 'guitar-pick').setOrigin(0.5, 0.5); // String 2
        this.guitarPick3 = this.add.sprite(game.config.width/3, this.rowPos[2], 'guitar-pick').setOrigin(0.5, 0.5); // String 3
        this.guitarPick4 = this.add.sprite(game.config.width/3, this.rowPos[3], 'guitar-pick').setOrigin(0.5, 0.5); // String 4

        // setup note group
        this.noteGroup = new NoteGroup(this, {
            classType: Note, // gameobject type
            key: 'guitar-pick', // texture
            quantity: this.noteCount, // number of objects in group
            active: true, // is active
            visible: true, // is visible
            setOrigin: {x: 0.5, y: 0.5} // origin position of texture (currently center)
        });

        // assign each note a spawn location
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) {
            this.noteGroup.getChildren()[i].assignX(this, i); // note's x position
            this.noteGroup.getChildren()[i].assignY(this); // note's y position
        }
    }

    // PHASER SCENE UPDATE METHOD
    update() {
        this.scrollGuitar(this.scrollSpeed); // scroll guitar to the by this.scrollspeed 
        this.scrollNotes(this.noteGroup); // scroll notes to the left by this.scrollspeed
        this.resetNotes(this.noteGroup); // reset notes when out of view
    }

    // for guitar scrolling animation
    scrollGuitar(speed) {
        this.guitarNeck.tilePositionX += speed; // scroll neck to the left
        this.guitarBodyBig.x -= speed; // scroll guitar big part to the left
        this.guitarBodySmall.x -= speed; // scroll guitar small part to the left
        if (this.guitarBodyBig.x == -game.config.height) this.guitarBodyBig.destroy(); // destroy when out of view
        if (this.guitarBodySmall.x == -game.config.height) this.guitarBodySmall.destroy(); // destroy when out of view
    }

    // for note scrolling
    scrollNotes(group) { group.scrollNotes(this); }

    // when notes are out of view, reset with new positions
    resetNotes(group) { group.resetNotes(this); }
}