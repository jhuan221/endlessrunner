class Instructions extends Phaser.Scene{
    constructor(){
        super("instructionsScene");
    }

    create(){
        //define key 
        keyRt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        //temp text
        this.add.text(20,20, ' how to play\n\n\n press → to go back');
    }

    update(){
        // checking if right key is pressed to go back to menu
        if (Phaser.Input.Keyboard.JustDown(keyRt)){
            this.scene.start('menuScene');
        }
    }
}