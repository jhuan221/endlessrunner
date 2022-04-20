// Main Play Scene

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.image('guitar-body', './assets/test-guitar-body.png'); // 'GUITAR BODY' W: 741 px, H: 741 px
        this.load.image('guitar-neck', './assets/test-guitar-neck.png'); // 'GUITAR NECK' W: 1200 px, H: 370 px
    }

    create() {
        this.guitarBodyBig = this.add.sprite((3*game.config.height)/4, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position behind guitar neck, scrolls left
        this.guitarNeck = this.add.tileSprite(0, game.config.height/2, 2400, 370, 'guitar-neck').setOrigin(0, 0.5); // guitar neck is the main scrolling tileset
        this.guitarBodySmall = this.add.sprite(game.config.width/4, game.config.height/2, 'guitar-body').setOrigin(0.5, 0.5); // position in front of guitar neck, scrolls left
        this.guitarBodyBig.setScale(2, 1.25); // (W, H) scaled to be larger than guitarBodySmall 
    }

    update() {
        // scrolling parts
        this.guitarNeck.tilePositionX += 1;
        this.guitarBodyBig.x -= 1;
        this.guitarBodySmall.x -= 1;
        // end scrolling parts


    }
}