// Main Play Scene

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        
    }

    preload() {
        this.load.image('guitar-body', './assets/test-guitar-body.png'); // 'GUITAR BODY' W: 741 px, H: 741 px
        this.load.image('guitar-neck', './assets/test-guitar-neck.png'); // 'GUITAR NECK' W: 1200 px, H: 370 px, fret spacing: 150 px
        this.load.image('guitar-pick', './assets/test-guitar-pick.png'); // 'GUITAR PICK' W: 50 px, H: 50px
    }

    create() {
        this.scrollSpeed = 1; // scrolling speed
        this.noteSize = 50; // pixel size of each note
        this.rowPos = [(2.5*game.config.height)/8, (3.5*game.config.height)/8, (4.5*game.config.height)/8, (5.5*game.config.height)/8]; // String rows
        this.lastRow = -1; // to track last row assignment
        this.lastCol = 0; // to track last col assignment

        this.guitarBodyBig = this.add.sprite((game.config.width)/2, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position behind guitar neck, scrolls left
        this.guitarNeck = this.add.tileSprite(0, game.config.height/2, 1280, 370, 'guitar-neck').setOrigin(0, 0.5); // guitar neck is the main scrolling tileset
        this.guitarBodySmall = this.add.sprite((3*game.config.width)/10, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position in front of guitar neck, scrolls left
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
            quantity: 12, // number of objects in group
            active: true, // is active
            visible: true, // is visible
            setOrigin: {x: 0.5, y: 0.5} // origin position of texture (currently center)
        });

        // assign each note spawn location
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) {
            this.noteGroup.getChildren()[i].x = this.assignX(i);
            this.noteGroup.getChildren()[i].y = this.assignY();
        }
    }

    // Phaser scene update method
    update() {
        this.scrollGuitar(this.scrollSpeed); // scroll guitar to the left 1 px/frame 
        let grouping = this.noteGroup.getChildren();
        for (let i = 0; i < grouping.length; i++) {
            grouping[i].moveX(-this.scrollSpeed);
        }
        for (let i = 0; i < grouping.length; i++) {
            if (grouping[i].x < -this.noteSize) {
                grouping[i].x = this.assignX();
                grouping[i].y = this.assignY();
            }
        }    

    }

    // for guitar scrolling animation
    scrollGuitar(fps) {
        this.guitarNeck.tilePositionX += fps;
        this.guitarBodyBig.x -= fps;
        this.guitarBodySmall.x -= fps;
        if (this.guitarBodyBig.x == -game.config.height) this.guitarBodyBig.destroy(); // destroy when out of view
        if (this.guitarBodySmall.x == -game.config.height) this.guitarBodySmall.destroy(); // destroy when out of view
    }

    // assign note x spawn location
    assignX(i = 1) {
        let spacingX = 120; // spacing between notes
        let x = game.config.width + spacingX * i; // generate note's x position
        // this.lastCol = x;
        return x;
    }

    // assign note y spawn location
    assignY() {
        let y = this.rowPos[Phaser.Math.Between(0, this.rowPos.length - 1)]; // generate note's y position (which string to spawn)
        while (this.lastRow == y) y = this.rowPos[Phaser.Math.Between(0, this.rowPos.length - 1)]; // compare to last y position to prevent overlap
        this.lastRow = y; // assign new previous y position
        return y;
    }
}