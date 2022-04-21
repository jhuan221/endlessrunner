// Main Play Scene

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.lastRow = -1; // to track last row assignment
        this.minType = 0; // the smallest number in a range for random type generator
        this.maxType = 9; // the largest number in a range for random type generator
        this.modType = 3; // the modulus used for assigning good or bad notes
        this.noteCount = 9; // number of notes to spawn on screen
        this.noteSize = 50; // pixel size of each note
        this.rowPos = [
            (2.5*game.config.height)/8, // String 1 (TOP)
            (3.5*game.config.height)/8, // String 2
            (4.5*game.config.height)/8, // String 3
            (5.5*game.config.height)/8  // String 4
        ];
        this.scrollSpeed = 1; // scrolling speed
        this.spacingX = 150; // spacing between notes
        this.gMoved = false;
        this.gYP = Phaser.Math.Between(0, this.rowPos.length - 1) // randomly chooses an index for pick Y position
        this.guitarPickX = game.config.width/5; // player's X position
        this.guitarPickY = this.rowPos[this.gYP]; // player's Y position
    }

    preload() {
        this.load.image('guitar-body', './assets/test-guitar-body.png'); // 'GUITAR BODY' W: 741 px, H: 741 px
        this.load.image('guitar-neck', './assets/test-guitar-neck2.png'); // 'GUITAR NECK' W: 1200 px, H: 370 px, fret spacing: 300 px
        this.load.image('guitar-pick', './assets/test-guitar-pick.png'); // 'GUITAR PICK' W: 50 px, H: 50 px
        this.load.image('good-note', './assets/test-good-note.png'); // 'GOOD NOTE' W: 50 px, H: 50 px
        this.load.image('bad-note', './assets/test-bad-note.png'); // 'BAD NOTE' W: 50 px, H: 50 px
    }

    create() {
        // create guitar parts
        this.guitarBodyBig = this.add.sprite(game.config.width/2, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position behind guitar neck
        this.guitarNeck = this.add.tileSprite(0, game.config.height/2, 1280, 370, 'guitar-neck').setOrigin(0, 0.5); // guitar neck is the main scrolling tileSprite
        this.guitarBodySmall = this.add.sprite((3*game.config.width)/10, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position in front of guitar neck
        this.guitarBodyBig.setScale(2, 1.25); // (W, H) scaled to be larger than guitarBodySmall
        this.guitarBodySmall.setScale(1.25, 1); // (W, H) scaled to cover guitar neck

        // player guitar pick
        this.guitarPick = this.add.sprite(
            this.guitarPickX, // starting x position 
            this.guitarPickY, // starting y position chosen at random 
            'guitar-pick' // guitar pick texture
            ).setOrigin(0.5, 0.5);
        
        // player controls
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); // arrow key UP
        keyDn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); // arrow key DOWN

        // setup note group
        this.noteGroup = new NoteGroup(this, {
            classType: Note, // gameobject type
            key: 'good-note', // default texture key
            quantity: this.noteCount, // number of objects in group
            active: true, // is active
            visible: true, // is visible
            setOrigin: {x: 0.5, y: 0.5} // origin position of texture (currently center)
        });

        // assign each note a name and several attributes
        this.initializeNotes();
    }

    // PHASER SCENE UPDATE METHOD
    update() {
        this.scrollGuitar(this.scrollSpeed); // scroll guitar to the by this.scrollspeed 
        this.scrollNotes(this.noteGroup); // scroll notes to the left by this.scrollspeed
        this.resetNotes(this.noteGroup); // reset notes when out of view
        this.checkCollisionIter(); // iterate over all notes and check for collisions
        // player controls
        this.inputDn(); // player presses DOWN key
        this.inputUp(); // player presses UP key
    }

    // basic AABB collider
    checkCollision(pick, note) {
        if (pick.x < note.x + note.width &&
            pick.x + pick.width > note.x &&
            pick.y < note.y + note.height &&
            pick.y + pick.height > note.y) {
                //console.log(note.name + ' isGood: ' + note.isGood); // for debugging
                note.visible = false; // make note invisible
            }    
    }

    // iterate over all notes to check for collisions
    checkCollisionIter() {
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) { 
            let child = this.noteGroup.getChildren()[i];
            this.checkCollision(this.guitarPick, child);
        }
    }

    // initial setup of notes
    initializeNotes() {
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) {
            let child = this.noteGroup.getChildren()[i]; // get individual note
            child.name = 'Note: ' + i; // set name of note
            this.setGroupChildAttr(child, i); // setup child attributes
        }
    }

    // player inputs DOWN key moves guitar pick down
    inputDn() {
        if (Phaser.Input.Keyboard.JustDown(keyDn) && this.gYP+1 < this.rowPos.length) {
            this.gMoved = true;
            this.gYP++; 
            this.guitarPick.y = this.rowPos[this.gYP];
        }
    }

    // player inputs UP key moves guitar pick up
    inputUp() {
        if (Phaser.Input.Keyboard.JustDown(keyUp) && this.gYP-1 > -1) {
            this.gMoved = true; 
            this.gYP--; 
            this.guitarPick.y = this.rowPos[this.gYP];
        }
    }

    // assign note attributes
    setGroupChildAttr(child, i = 0) {
        let res = Phaser.Math.Between(this.minType, this.maxType); // randomly generate type attribute
        child.isGood = res % this.modType == 0 ? true : false; // set note if isGood or not isGood
        child.setText(child.isGood ? 'good-note' : 'bad-note'); // assign proper texture based on isGood
        child.assignX(this, i); // note's x position
        child.assignY(this); // note's y position
        child.visible = true; // note's visibility true
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