// The Note Physics Sprite Class

class Note extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    moveX(x) { this.x += x; }
}

class NoteGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene, config);
    }
}