class Instructions extends Phaser.Scene{
    constructor(){
        super("instructionsScene");
    }

    preload(){
        this.load.image('howtoplay', './assets/howtoplay.png');
    }

    create(){
        //define key 
        keyRt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.sprite(640,400, 'howtoplay').setOrigin(0.5);
        
        //temp text
        //this.add.text(20,20, ' how to play\n\n\n press → to go back');
    }

    update(){
        // checking if right key is pressed to go back to menu
        if (Phaser.Input.Keyboard.JustDown(keyRt)){
            this.scene.start('menuScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.scene.start('playScene');
        }
    }
}