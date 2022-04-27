// Main Play Scene

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.scrollSpeed = 2; // game scrolling speed

        // guitar strings
        this.rowPos = [
            (2.5*game.config.height)/8, // String 1 (TOP)
            (3.5*game.config.height)/8, // String 2
            (4.5*game.config.height)/8, // String 3
            (5.5*game.config.height)/8  // String 4
        ];
        
        // note/note group variables
        this.lastRow = -1; // to track last row assignment of a note
        this.minType = 0; // the smallest number in a range for random note type generator
        this.maxType = 9; // the largest number in a range for random note type generator
        this.modType = 3; // the modulus used for assigning good or bad notes
        this.noteCount = 9; // number of notes to spawn on screen
        this.noteSize = 50; // pixel size of each note
        this.spacingX = 150; // spacing between notes
        this.gPts = 10; // good notes: +10 points
        this.bPts = -5; // bad notes: -5 points
        this.PU_spawn = false; // if true, note group will try to spawn a power-up (logic prevents having too many power-ups at one time)
        this.PU_active = false;
        this.PU_timer; 

        // guitar pick variables
        this.gY = Phaser.Math.Between(0, this.rowPos.length - 1) // randomly chooses an index for pick starting Y position
        this.guitarPickX = game.config.width/10; // player's starting X position
        this.guitarPickY = this.rowPos[this.gY]; // player's starting Y position
        this.moveSpeed = 5; // guitar pick moving speed

    }

    // PHASER SCENE PRELOAD METHOD
    preload() {
        this.load.image('guitar-body', './assets/tinified/test-guitar-body.png'); // 'GUITAR BODY' W: 741 px, H: 741 px
        this.load.image('guitar-neck', './assets/tinified/test-guitar-neck2.png'); // 'GUITAR NECK' W: 1200 px, H: 370 px, fret spacing: 300 px
        this.load.image('guitar-pick', './assets/tinified/test-guitar-pick.png'); // 'GUITAR PICK' W: 50 px, H: 50 px
        this.load.image('good-note', './assets/tinified/test-good-note.png'); // 'GOOD NOTE' W: 50 px, H: 50 px
        this.load.image('bad-note', './assets/tinified/test-bad-note.png'); // 'BAD NOTE' W: 50 px, H: 50 px
        this.load.image('powerup-note', './assets/tinified/test-powerup-note.png'); // 'POWERUP NOTE' W: 50 px, H: 50 px
    }

    // PHASER SCENE CREATE METHOD
    create() {

        // create guitar parts
        this.guitarBodyBig = this.add.sprite(game.config.width/2, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position behind guitar neck
        this.guitarNeck = this.add.tileSprite(0, game.config.height/2, 1280, 370, 'guitar-neck').setOrigin(0, 0.5); // guitar neck is the main scrolling tileSprite
        this.guitarBodySmall = this.add.sprite((3*game.config.width)/10, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position in front of guitar neck
        this.guitarBodyBig.setScale(2, 1.25); // (W, H) scaled to be larger than guitarBodySmall
        this.guitarBodySmall.setScale(1.25, 1); // (W, H) scaled to cover guitar neck

        // player guitar pick
        this.guitarPick = new GuitarPick(this, // this scene
                                        this.guitarPickX, // starting x position
                                        this.guitarPickY, // starting y position
                                        'guitar-pick', // texture
                                        this.moveSpeed, // move speed
                                        this.guitarPickX, // minimum x position
                                        (9*game.config.width)/10) // maximum x position
                                        .setOrigin(0.5, 0.5);

        // player controls
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); // arrow key UP
        keyDn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); // arrow key DOWN
        keyLt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); // arrow key LEFT
        keyRt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); // arrow key RIGHT
            
        // setup note group
        this.noteGroup = new NoteGroup(this, {
            classType: Note, // gameobject type
            key: 'good-note', // default texture key
            quantity: this.noteCount, // number of objects in group
            active: true, // is active
            visible: true, // is visible
            setOrigin: {x: 0.5, y: 0.5} // origin position of texture (currently center)
        });

        // power-up timer configuration
        this.powerupTimerConfig = {
            callback: () => {
                this.PU_spawn = true;
                console.log('power-up spawn enabled');
            },
            callbackScope: this,
            delay: 10000 // 10 seconds
        };

        // power-up timer
        this.powerupTimer = this.time.addEvent(this.powerupTimerConfig);

        // power-up types
        this.PU_Inv = new Invincible('invincible', this.move);

        // game start or paused
        this.gameStart = false;

        // tracks how much time elapsed since start of Play
        this.gameTimeElapsed = 0; 

        // game timer configuration
        this.gameTimerConfig = {
            callback: () => {
                this.gameTimeElapsed += 1;
                console.log('Game Time: ' + this.gameTimeElapsed);
            },
            callbackScope: this,
            delay: 1000, // 1 second
            loop: true, // continue to increment time
            paused: true // timer is paused initially
        };

        // scene timer
        this.gameTimer = this.time.addEvent(this.gameTimerConfig);

        // player score
        this.playerScore = 0;

        // display score 
        let scoreConfig = {                             // configuarations for score
            fontFamily: 'Andale Mono',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreCenter = this.add.text(580, 20,     
        this.playerScore, scoreConfig);

        // assign each note a name and several attributes
        this.initializeNotes();
        // start game countdown
        this.startCountDown();
    }

    // PHASER SCENE UPDATE METHOD
    update() {
        if (this.gameStart) {
            this.scrollGuitar(this.scrollSpeed); // scroll guitar to the left by this.scrollspeed 
            this.scrollNotes(this.noteGroup); // scroll notes to the left by this.scrollspeed
        }
        this.resetNotes(this.noteGroup); // reset notes when out of view
        this.checkCollisionIter(); // iterate over all notes and check for collisions
        this.guitarPick.update(this); // update player guitar pick
    }

    // assess if points should be applied
    assessPoints(pick, note) {
        if (!pick.isInv ||
            pick.isInv && note.isGood)
            return note.points;
        else
            return 0;
    }

    // basic AABB collider
    checkCollision(pick, note) {
        if (pick.x < note.x + note.width &&
            pick.x + pick.width > note.x &&
            pick.y < note.y + note.height &&
            pick.y + pick.height > note.y &&
            note.active) {
                //console.log(note.name + ' isGood: ' + note.isGood); // for debugging
                note.visible = false; // make note invisible
                note.active = false; // make note not interactable
                if (note.isPowerUp && !this.PU_active) {
                    this.PU_active = true;
                    note.powerUpType.modifyScene(this.guitarPick, this); // change scene state to reflect power-up effects
                } else {
                    this.playerScore += this.assessPoints(pick, note); // apply point values to player score
                    console.log('Score: ' + this.playerScore);
                    this.scoreCenter.text = this.playerScore;
                }
            }    
    }

    // iterate over all notes to check for collisions
    checkCollisionIter() {
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) 
            this.checkCollision(this.guitarPick, this.noteGroup.getChildren()[i]);
    }

    // initial setup of notes
    initializeNotes() {
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) {
            let child = this.noteGroup.getChildren()[i]; // get individual note
            child.name = 'Note: ' + i; // set name of note
            this.setGroupChildAttr(child, i); // setup child attributes
        }
    }

    // when notes are out of view, reset with new positions
    resetNotes(group) { group.resetNotes(this); }

    // assign note attributes
    setGroupChildAttr(child, i = 0) {
        let res = Phaser.Math.Between(this.minType, this.maxType); // randomly generate type attribute
        child.isGood = res % this.modType == 0 ? true : false; // set note if isGood or not isGood
        if (this.PU_spawn && child.isGood && res == 0) { 
            this.PU_spawn = false; // prevent more powerups from spawning until timer elapses
            this.powerupTimer = this.time.addEvent(this.powerupTimerConfig); // timer until next powerup can spawn
            child.isPowerUp = true; // good note is upgraded to a powerup note
            child.powerUpType = this.PU_Inv;
            child.setText('powerup-note'); // set note texture to powerup texture
        } else {
            child.isPowerUp = false;
            child.powerUpType = new PowerUp('none');
            child.setPoints(child.isGood ? this.gPts : this.bPts); // set note's point value
            child.setText(child.isGood ? 'good-note' : 'bad-note'); // assign proper texture based on isGood
        }
        child.assignX(this, i); // note's x position
        child.assignY(this); // note's y position
        child.visible = true; // note's visibility true
        child.active = true; // note is interactable
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

    // start of game countdown
    startCountDown() {
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) 
            this.noteGroup.getChildren()[i].visible = false;

        let countdown = 4;

        // display countdown before start of game
        this.countdownTimer = this.time.addEvent({
            callback: () => {
                console.log('Countdown: ' + (countdown - 1));
                countdown -= 1;
            },
            callbackScope: this,
            delay: 1000, // 1 second
            loop: true
        })
        
        // scene waiting for countdown to expire (simultaneous countdown with countdownTimer)
        this.startTimer = this.time.addEvent({
            callback: () => {
                this.gameStart = true; // start game
                this.gameTimer.paused = false; // start game timer
                this.countdownTimer.remove(); // remove countdown timer
                for (let i = 0; i < this.noteGroup.getChildren().length; i++) // set all notes to visible
                    this.noteGroup.getChildren()[i].visible = true;
            },
            callbackScope: this,
            delay: 4000 // 4 second countdown
        })
    }


}