// The Note Sprite Class

class Note extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture);
    
        this.type = type;
    }

    moveX(x) { this.x += x; } // move note across the screen

    assignX(scene, i = 1) { this.x = game.config.width + scene.spacingX * i; } // generate note's x position

    assignY(scene) {
        this.y = scene.rowPos[Phaser.Math.Between(0, scene.rowPos.length - 1)]; // generate note's y position (which string to spawn on)
        while (scene.lastRow == this.y) this.y = scene.rowPos[Phaser.Math.Between(0, scene.rowPos.length - 1)]; // compare to last used y position to prevent overlap
        scene.lastRow = this.y; // return new y position to be saved as last y position
    }
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
            if (this.getChildren()[i].x < -scene.noteSize) { // if note scrolls out of view
                this.getChildren()[i].assignX(scene); // assign new x
                this.getChildren()[i].assignY(scene); // assign new y
            }
        }
    }
}