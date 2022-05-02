// Main Play Scene

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.scrollSpeed = 3; // game scrolling speed

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

        // note powerup variables
        this.PU_spawn = false; // if true, note group will try to spawn a power-up (logic prevents having too many power-ups at one time)
        this.PU_active = false; // if true, a powerup was picked up and is active
        this.bulletCount = 15; // USED ONLY FOR DEBUGGING

        // guitar pick variables
        this.gY = Phaser.Math.Between(0, this.rowPos.length - 1) // randomly chooses an index for pick starting Y position
        this.guitarPickX = game.config.width/10; // player's starting X position
        this.guitarPickY = this.rowPos[this.gY]; // player's starting Y position
        this.moveSpeed = 5; // guitar pick moving speed
        
    }

    // PHASER SCENE PRELOAD METHOD
    preload() {
        this.load.image('guitar-body', './assets/tinified/test-guitar-body.png'); // 'GUITAR BODY' W: 741 px, H: 741 px
        this.load.image('guitar-neck', './assets/G_Neck.png'); // 'GUITAR NECK' W: 1200 px, H: 370 px, fret spacing: 300 px
        this.load.image('guitar-pick', './assets/Pick_Sprite_1.png'); // 'GUITAR PICK' W: 50 px, H: 50 px
        this.load.image('good-note', './assets/Good_Note.png'); // 'GOOD NOTE' W: 50 px, H: 50 px
        this.load.image('bad-note', './assets/Bad_Note.png'); // 'BAD NOTE' W: 50 px, H: 50 px
        this.load.image('powerup-note', './assets/tinified/test-powerup-note.png'); // 'POWERUP NOTE' W: 50 px, H: 50 px
        this.load.image('invincible_text', './assets/Protect.png'); // Invincibility Sprite
        this.load.spritesheet('bar', './assets/Bar-Sheet.png', {frameWidth: 400, frameHeight: 100, startFrame: 0, endFrame: 16}); // 'BAR' W: 400 pc, H; 100 px
        this.load.image('gameover', './assets/gameovertitle.png' );
        this.load.spritesheet('cd', './assets/countdown.png', {frameWidth: 507, frameHeight: 480, startFrame: 0, endFrame: 2});
        // load audio
        this.load.audio('sfx_bad', './assets/audio/badnote_01.wav');
        this.load.audio('sfx_good', './assets/audio/goodnote_01.wav');
        this.load.audio('sfx_cheer', './assets/audio/cheering3.wav', {volume: 0.1});
        this.load.audio('sfx_boring', './assets/audio/boring1.wav', {volume: 0.2});
        this.load.audio('sfx_gameover', './assets/audio/gamefail.wav');
    }

    // PHASER SCENE CREATE METHOD
    create() {

        // create guitar parts
        this.guitarBodyBig = this.add.sprite(game.config.width/2, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position behind guitar neck
        this.guitarNeck = this.add.tileSprite(0, game.config.height/2, 1280, 370, 'guitar-neck').setOrigin(0, 0.5); // guitar neck is the main scrolling tileSprite
        this.guitarBodySmall = this.add.sprite((3*game.config.width)/10, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position in front of guitar neck
        this.guitarBodyBig.setScale(2, 1.25); // (W, H) scaled to be larger than guitarBodySmall
        this.guitarBodySmall.setScale(1.25, 1); // (W, H) scaled to cover guitar neck

        // player controls
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); // arrow key UP
        keyDn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); // arrow key DOWN
        keyLt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); // arrow key LEFT
        keyRt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); // arrow key RIGHT
        keySp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // space bar for shooting
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);    // m for return to menu
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);    // r to restart

        // setup note group
        this.noteGroup = new NoteGroup(this, {
            classType: Note, // gameobject type
            key: 'good-note', // default texture key
            quantity: this.noteCount, // number of objects in group
            active: true, // is active
            visible: true, // is visible
            setOrigin: {x: 0.5, y: 0.5} // origin position of texture (currently center)
        });

        // player guitar pick
        this.guitarPick = new GuitarPick(this, // this scene
                                        this.guitarPickX, // starting x position
                                        this.guitarPickY, // starting y position
                                        'guitar-pick', // texture
                                        this.moveSpeed, // move speed
                                        this.guitarPickX, // minimum x position
                                        (9*game.config.width)/10) // maximum x position
                                        .setOrigin(0.5, 0.5);

        this.bulletGroup = new BulletGroup(this, {
            classType: GuitarBullet,
            key: 'guitar-pick',
            quantity: this.bulletCount,
            active: false,
            visible: false,
            setOrigin: {x: 0.5, y: 0.5},
            setScale: {x: 0.5, y: 0.5}
        })

        // power-up timer configuration
        this.powerupTimerConfig = {
            callback: () => {
                this.PU_spawn = true;
                //console.log('power-up spawn enabled');
            },
            callbackScope: this,
            delay: 10000 // 10 seconds
        };

        // power-up timer
        this.powerupTimer = this.time.addEvent(this.powerupTimerConfig);

        // power-up types
        this.PU_Inv = new Invincible('invincible', 3, 5000); // INVINCIBILITY MODE
        this.PU_Str = new Shooter('shooter', 0, 7000); // SHOOTER MODE
        this.PU_Ary = [
            this.PU_Inv, 
            this.PU_Str
        ];

        // game start or paused
        this.gameStart = false;

        // tracks how much time elapsed since start of Play
        this.gameTimeElapsed = 0; 

        // game timer configuration
        this.gameTimerConfig = {
            callback: () => {
                this.gameTimeElapsed += 1;
                //console.log('Game Time: ' + this.gameTimeElapsed);
            },
            callbackScope: this,
            delay: 1000, // 1 second
            loop: true, // continue to increment time
            paused: true // timer is paused initially
        };

        // display config
        let displayConfig = {                             // configuarations for score
            fontFamily: 'Andale Mono',
            fontSize: '28px',
            backgroundColor: '#bababa',
            color: '#000000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 100
        }
        // scene timer
        this.gameTimer = this.time.addEvent(this.gameTimerConfig);
        
        // display time
        this.timeLeft = this.add.text(20, 40, this.gameTimeElapsed + " secs", 
        displayConfig);

        // player score
        this.playerScore = 0;

        // display score 
        this.scoreCenter = this.add.text(580, 40,     
        this.playerScore, displayConfig);

        // cheer bar setup 
        // cheer bar variables
        this.barStatus = 1;                 // current frame bar is on
        this.badNoteCount = 0;              // current count of player hitting bad note
        this.goodNoteCount = 0;             // current count of player hitting good note
        this.cheerbar = this.add.sprite(1085, 60, 'bar', this.barStatus).setOrigin(0.5);
        //this.barStatus = 16;
        //this.cheerbar.frame = this.barStatus;
        //console.log("current frame: " + this.cheerbar.frame);
        //this.cheerbar.visible = false;
        // this.cheerbar.setFrame(3);

        // assign each note a name and several attributes
        this.initializeNotes();
        // start game countdown
        this.counter = 0;
        this.displaycd = this.add.sprite(640, 400, 'cd').setOrigin(0.5);
        this.startCountDown();

        // game over screen
        this.gameOver = false;
        this.go = this.add.sprite(640, 400, 'gameover').setOrigin(0.5);
        this.go.visible = false;

        //game sound vars
        this.increasevol = 0.1;
        this.decreasevol = 0.1;
        this.cheer = this.sound.add('sfx_cheer', {volume: 0.1});
        this.boo = this.sound.add('sfx_boring', {volume: 0.5});
        this.firstc = true;
        this.firstb = true;

    }

    // PHASER SCENE UPDATE METHOD
    update() {
        if (this.gameStart) {
            this.scrollGuitar(this.scrollSpeed); // scroll guitar to the left by this.scrollspeed 
            this.scrollNotes(this.noteGroup); // scroll notes to the left by this.scrollspeed
            this.timeLeft.text = this.gameTimeElapsed + " secs"; // updating timer display
        }
        if (!this.gameOver){
            this.resetNotes(this.noteGroup); // reset notes when out of view
            this.checkCollisionBullets(); // iterate over all bullets and notes for collisions
            this.checkCollisionNotes(); // iterate over all notes and check for collisions
            this.guitarPick.update(this); // update player guitar pick
            this.fireBullet(); // SHOOTER MODE: fire bullets loaded into bulletGroup
            //console.log('Active Bullet Count: ' + this.bulletGroup.getLength());
            //this.cheer.play();
        }
        else if (this.gameOver){
            //this.scene.start('gameOverScene');
            this.gameStart = false;
            this.go.visible = true;
            if (Phaser.Input.Keyboard.JustDown(keyR)){
                this.registry.destroy(); // dump data in DataManager
                this.events.off() // dump any allocated events in Scene
                this.scene.restart(); // restart
            }
            if(Phaser.Input.Keyboard.JustDown(keyM)){
                this.scene.start('menuScene');
            }
        }
    }

    // changing the current movement on the bar
    // if player hits 3 bad notes == decrease
    // if player hits 5 good notes == increase;
    // else if it hit good/bad note, increase respective counter
    barMovement(pick, note){
        // console.log("BAD: " + this.badNoteCount);
        // console.log("GOOD: " + this.goodNoteCount);
        if (note.isGood){
            //console.log("good note hit\n");
            this.goodNoteCount++;
        }
        else if (!note.isGood){
            this.badNoteCount++;
        }
        // console.log("BAD: " + this.badNoteCount);
        // console.log("GOOD: " + this.goodNoteCount);

        if (this.badNoteCount == 3){
            //console.log("\N BAR CHANGE DECREASE \N");
            if (this.barStatus > 0){
                this.barStatus--;
                this.cheerbar.setFrame(this.barStatus);
                this.badNoteCount = 0;
                if (this.firstb){
                    this.boo.play();
                    this.firstb = false;
                }
                else{
                    this.increasevol += 0.1;
                    this.decreasevol+= 0.2;
                    this.boo.volume += this.increasevol;
                    this.cheer.volume -= this.decreasevol;
                    console.log("INCREASE boo\n");
                    console.log("current cheer volume: " + this.cheer.volume);
                    console.log("current boo volume: " + this.boo.volume);
                }
                return;
            }
            else{
                this.gameOver = true;
                this.sound.stopAll();
                return;
            }
        }
        else if (this.goodNoteCount == 5){
            console.log("\N BAR CHANGE INCREASE \N");
            if (this.barStatus != 16){
                this.barStatus++;
                this.cheerbar.setFrame(this.barStatus);
                this.goodNoteCount = 0;
                this.increasevol+= 0.1;
                this.decreasevol += 0.2;
                this.cheer.volume += this.increasevol;
                if (!this.firstb){
                    this.boo.volume -= this.decreasevol;
                }
                console.log("INCREASE CHEER\n");
                console.log("current cheer volume: " + this.cheer.volume);
                console.log("current boo volume: " + this.boo.volume);
                return;
            }
        }
       return;
    }

    // assess if points should be applied
    assessPoints(pick, note) {
       this.barMovement(pick, note);
        if (note.isGood){
            return note.points;
        }
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
                if (note.isGood){
                    this.sound.play('sfx_good');
                }
                else if (!note.isGood && !note.isPowerUp){
                    this.sound.play('sfx_bad');
                }
                note.visible = false; // make note invisible
                note.active = false; // make note not interactable
                if (note.isPowerUp && !this.PU_active) { // if note was a powerup
                    this.PU_active = true; // set powerup active to true
                    note.powerUpType.modifyScene(this.guitarPick, this); // change scene state to reflect powerup effects
                } else if (pick.name == 'bullet') { // if the pick was a bullet (SHOOTER MODE) 
                    this.bulletGroup.killAndHide(pick);
                    pick.x = 0;
                    pick.y = 0;
                } else {
                    this.playerScore += this.assessPoints(pick, note); // apply point values to player score
                    //console.log('Score: ' + this.playerScore);
                    this.scoreCenter.text = this.playerScore;           // changing the score display
                }
            }    
    }

    // iterate over all notes and bullets to check for collisions
    checkCollisionBullets() {
        for (let i = 0; i < this.bulletGroup.getChildren().length; i++) {
            for (let j = 0; j < this.noteGroup.getChildren().length; j++) {
                this.checkCollision(this.bulletGroup.getChildren()[i], this.noteGroup.getChildren()[j]);
            }
        }
    }

    // iterate over all notes to check for collisions
    checkCollisionNotes() {
        for (let i = 0; i < this.noteGroup.getChildren().length; i++) 
            this.checkCollision(this.guitarPick, this.noteGroup.getChildren()[i]);
    }

    // when in shooter mode, fire bullets loaded into bulletGroup
    fireBullet() {
        for (let i = 0; i < this.bulletGroup.getChildren().length; i++) {
            let child = this.bulletGroup.getChildren()[i];
            if (child.active && child.visible) {
                child.x += 5;
            }
            if (child.x > game.config.width) {
                this.bulletGroup.killAndHide(child);
                child.x = 0;
                child.y = 0;
            }
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
            child.powerUpType = this.PU_Ary[Phaser.Math.Between(0, this.PU_Ary.length - 1)]; // select a powerup at random
            if (child.powerUpType.name == 'invincible')
                child.setText('invincible_text'); // set note texture to powerup texture
            if (child.powerUpType.name == 'shooter')
                child.setText('powerup-note');
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
                this.counter++;
                this.displaycd.setFrame(this.counter);
                if (this.counter >= 3) this.displaycd.visible = false;
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
                this.cheer.play();
                for (let i = 0; i < this.noteGroup.getChildren().length; i++) // set all notes to visible
                    this.noteGroup.getChildren()[i].visible = true;
            },
            callbackScope: this,
            delay: 4000 // 4 second countdown
        })
    }


}