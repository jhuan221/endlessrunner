// Guitar pick class

class GuitarPick extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, speed, minX, maxX) {
        super(scene, x, y, texture);

        scene.add.existing(this); // add object to scene
        this.minX = minX; // min X position
        this.maxX = maxX; // max X position
        this.moveSpeed = speed; // guitar pick moving speed
        this.gMoved = false; // up/down input triggers up/down movement once per key press
        this.gMovedDown = false; // true: pick is in motion moving down
        this.gMovedUp = false; // true: pick is in motion moving up
    }

    // PHASER OBJECT UPDATE METHOD
    update(scene) {
        this.inputUp(scene); // player moves up
        this.inputDn(scene); // player moves down
        this.inputLt(); // player moves left
        this.inputRt(); // player moves right
    }

    // UP key moves guitar pick up
    inputUp(scene) {
        // FIRST VERSION
        // if (Phaser.Input.Keyboard.JustDown(keyUp) && this.gY-1 > -1) {
        //     this.gY--; 
        //     this.guitarPick.y = this.rowPos[this.gY];
        // }

        // SECOND VERSION
        if (!this.gMoved && 
            Phaser.Input.Keyboard.JustDown(keyUp) && // check if up key was pressed
            scene.gY-1 > -1 && // check if moving up would throw pick out of bounds
            this.y > scene.rowPos[scene.gY-1]) { // check if pick is below the target string
                scene.gY--; // update Y position tracker in scene
                this.gMoved = true; // up/down input triggers up/down movement once per key press 
                this.gMovedUp = true; // pick is in motion moving to the next string above
        }
        if (this.gMovedUp && this.y > scene.rowPos[scene.gY]) {
            this.y -= this.moveSpeed; // keep moving up at this speed until pick reaches target string
        }
        if (this.gMovedUp && this.y <= scene.rowPos[scene.gY]) { // once pick arrives at target string, reset flags
            this.gMovedUp = false;
            this.gMoved = false;
        }

        // THIRD VERSION
        //if (keyUp.isDown && this.guitarPick.y > this.rowPos[0]) this.guitarPick.y -= this.moveSpeed;
    }

    // DOWN key moves guitar pick down
    inputDn(scene) {
        // FIRST VERSION
        // if (Phaser.Input.Keyboard.JustDown(keyDn) && this.gY+1 < this.rowPos.length) {
        //     this.gY++; 
        //     this.guitarPick.y = this.rowPos[this.gY];
        // }

        // SECOND VERSION
        if (!this.gMoved && 
            Phaser.Input.Keyboard.JustDown(keyDn) && // check if down key was pressed
            scene.gY+1 < scene.rowPos.length && // check if moving down would throw pick out of bounds
            this.y < scene.rowPos[scene.gY+1]) { // check if pick is above the target string
                scene.gY++; // update Y position tracker in scene
                this.gMoved = true; // up/down input triggers up/down movement once per key press 
                this.gMovedDown = true; // pick is in motion moving to the next string below
        }
        if (this.gMovedDown && this.y < scene.rowPos[scene.gY]) {
            this.y += this.moveSpeed; // keep moving up at this speed until pick reaches target string
        }
        if (this.gMovedDown && this.y >= scene.rowPos[scene.gY]) { // once pick arrives at target string, reset flags
            this.gMovedDown = false;
            this.gMoved = false;
        }

        // THIRD VERSION
        //if (keyDn.isDown && this.guitarPick.y < this.rowPos[this.rowPos.length-1]) this.guitarPick.y += this.moveSpeed;
    }

    // LEFT key moves guitar pick left (backward)
    inputLt() {
        if (keyLt.isDown && this.x > this.minX) { // check if left key is held down and is not at the minX
            this.x -= this.moveSpeed; // move to the left at this speed while held down
        }
    }

    // RIGHT key moves guitar pick right (forward)
    inputRt() {
        if (keyRt.isDown && this.x < this.maxX) { // check if right key is held down and is not at the maxX
            this.x += this.moveSpeed; // move to the right at this speed while held down
        }
    }
}