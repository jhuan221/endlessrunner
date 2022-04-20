// Main Play Scene

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.image('guitar-body', './assets/test-guitar-body.png'); // 'GUITAR BODY' W: 741 px, H: 741 px
        this.load.image('guitar-neck', './assets/test-guitar-neck.png'); // 'GUITAR NECK' W: 1200 px, H: 370 px
        this.load.image('guitar-pick', './assets/test-guitar-pick.png'); // 'GUITAR PICK' W: 50 px, H: 50px
    }

    create() {
        this.guitarBodyBig = this.add.sprite(game.config.width/3, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position behind guitar neck, scrolls left
        this.guitarNeck = this.add.tileSprite(0, game.config.height/2, 2400, 370, 'guitar-neck').setOrigin(0, 0.5); // guitar neck is the main scrolling tileset
        this.guitarBodySmall = this.add.sprite(game.config.width/4, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position in front of guitar neck, scrolls left
        this.guitarBodyBig.setScale(2, 1.25); // (W, H) scaled to be larger than guitarBodySmall

        // guitar picks are displayed to experiment with string (lane) spacing
        this.guitarPick1 = this.add.sprite(game.config.width/3, (2.5*game.config.height)/8, 'guitar-pick').setOrigin(0.5, 0.5); // String 1 (TOP)
        this.guitarPick2 = this.add.sprite(game.config.width/3, (3.5*game.config.height)/8, 'guitar-pick').setOrigin(0.5, 0.5); // String 2
        this.guitarPick3 = this.add.sprite(game.config.width/3, (4.5*game.config.height)/8, 'guitar-pick').setOrigin(0.5, 0.5); // String 3
        this.guitarPick4 = this.add.sprite(game.config.width/3, (5.5*game.config.height)/8, 'guitar-pick').setOrigin(0.5, 0.5); // String 4
    }

    update() {
        // scrolling parts
        this.guitarNeck.tilePositionX += 1;
        this.guitarBodyBig.x -= 1;
        this.guitarBodySmall.x -= 1;
        if (this.guitarBodyBig.x == -game.config.height) this.guitarBodyBig.destroy(); // when out of view
        if (this.guitarBodySmall.x == -game.config.height) this.guitarBodySmall.destroy(); // when out of view
        // end scrolling parts


    }
}