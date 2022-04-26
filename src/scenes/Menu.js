class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    create(){
        //this.scene.start("playScene");
        // just a temp config for the menu for now
        let menuConfig = {
            fontFamily: 'Helvetica',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#0047ab',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // temporary menu text
        this.add.text(640, 400, 'Untitled Music IR Game', menuConfig).setOrigin(0.5);
        this.add.text(640, 480, 'press space to start', menuConfig).setOrigin(0.5);

        // defining keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            console.log("space is pressed");
            this.scene.start('playScene');
        }
    }
}