// The Note Physics Sprite Class

class Note extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    moveX(x) { this.x += x; } // move note across the screen

    assignX(scene, i = 1) { this.x = game.config.width + scene.spacingX * i; } // generate note's x position

    assignY(scene) {
        this.y = scene.rowPos[Phaser.Math.Between(0, scene.rowPos.length - 1)]; // generate note's y position (which string to spawn)
        while (scene.lastRow == this.y) this.y = scene.rowPos[Phaser.Math.Between(0, scene.rowPos.length - 1)]; // compare to last y position to prevent overlap
        scene.lastRow = this.y; // return new y position to be saved as last y position
    }
}

class NoteGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene, config);
    }
}