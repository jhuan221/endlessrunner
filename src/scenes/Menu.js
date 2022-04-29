class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");

    }

    preload(){
        this.load.image('menu', './assets/menu.png');
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
        // this.add.text(640, 400, 'Endless Strummer', menuConfig).setOrigin(0.5);
        // this.add.text(640, 480, 'press space to start', menuConfig).setOrigin(0.5);
        // this.add.text(640, 560, 'press ← for how to play', menuConfig).setOrigin(0.5);

        // defining keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        // animation config
        this.anims.create({
            key: 'show', 
            frames: this.anims.generateFrameNumbers('title', {start: 0, end: 149, first: 0}),
            frameRate: 40
        });
    }

    update(){
        this.add.sprite(640,400, 'menu').setOrigin(0.5);
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            //console.log("space is pressed");
            this.scene.start('playScene');
        }
        if(Phaser.Input.Keyboard.JustDown(keyLt)){
            this.scene.start('instructionsScene');
        }
    }
}