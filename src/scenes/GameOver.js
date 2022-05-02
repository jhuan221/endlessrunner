// Game Over Scene
class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    preload() {
        this.load.image('gameover', './assets/gameovertitle.png' );

    }

    create() {
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);    // m for return to menu
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);    // r to restart

        this.go = this.add.sprite(640, 400, 'gameover').setOrigin(0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyR)){
                this.scene.start('playScene');
        }
        if(Phaser.Input.Keyboard.JustDown(keyM)){
                this.scene.start('menuScene');
        }
    }
}