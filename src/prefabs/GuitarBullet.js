
class GuitarBullet extends GuitarPick {
    constructor(scene, x, y, texture, speed) {
        super(scene, x, y, texture);
        this.setScale(0.5, 0.5);

        this.name = 'bullet';
        this.moveSpeed = speed;
    }
}

class BulletGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene, config);
    }

    // loadBullet(scene) {
    //     let bullet = this.getFirstDead(
    //         false,
    //         scene.guitarPick.x,
    //         scene.guitarPick.y,
    //         'guitar-pick',
    //         );
    //     if (bullet) {
    //         bullet.fire(scene.guitarPick.x, scene.guitarPick.y);
    //     } 
    // }
}