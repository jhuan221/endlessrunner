class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");

    }

    preload(){
        this.load.image('menu', './assets/menu.png');
        this.load.audio('sfx_start', './assets/audio/gamestart.wav', {volume:0.3});
    }

    create(){
        this.add.sprite(640,400, 'menu').setOrigin(0.5);
       
        // defining keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            //console.log("space is pressed");
            this.sound.play('sfx_start');
            this.scene.start('playScene');
        }
        if(Phaser.Input.Keyboard.JustDown(keyLt)){
            this.scene.start('instructionsScene');
        }
    }
}