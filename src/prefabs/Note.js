// The Note Sprite Class

class Note extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.name = ''; // name of object (for debugging)
        this.points = 0; // point value of note (good: +10, bad: -5)
        this.powerUpType = new PowerUp('none'); // if note is a power up, this is the power-up type

        this.isActive = true; // true: collision with note affects Play parameters
        this.isGood = true; // is good note or not (bad note)
        this.isPowerUp = false; // is a powerup note
    }

    // move note across the screen
    moveX(x) { this.x += x; } 

    // generate note's x position
    assignX(scene, i = 1) { 
        this.x = game.config.width + (scene.spacingX + Phaser.Math.Between(-10, 10)) * i; 
    } 

    // generate note's y position (which string to spawn on)
    assignY(scene) {
        this.y = scene.rowPos[Phaser.Math.Between(0, scene.rowPos.length - 1)]; 
        while (scene.lastRow == this.y) this.y = scene.rowPos[Phaser.Math.Between(0, scene.rowPos.length - 1)]; // compare to last used y position to prevent overlap
        scene.lastRow = this.y; // return new y position to be saved as last y position
    }

    setPoints(pts) { this.points = pts; } // set point value based on good note or bad note

    setText(texture) { this.setTexture(texture); } // set texture of note
}

// The Note Group Class

class NoteGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene, config);
    }

    // for note scrolling
    scrollNotes(scene) { 
        for (let i = 0; i < this.getLength(); i++) 
            this.getChildren()[i].moveX(-scene.scrollSpeed); 
    }

    // when notes are out of view, reset with new positions
    resetNotes(scene) {
        for (let i = 0; i < this.getLength(); i++) {
            let child = this.getChildren()[i];
            if (child.x < -scene.noteSize) scene.setGroupChildAttr(child); // if note scrolls out of view, reset attributes
        }
    }
}