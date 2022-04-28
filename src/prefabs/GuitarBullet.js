
class GuitarBullet extends GuitarPick {
    constructor(scene, x, y, texture, speed) {
        super(scene, x, y, texture);
        this.setScale(0.5, 0.5);
        this.moveSpeed = speed;
    }

    setBullet(scene) {
        this.x = scene.guitarPick.x;
        this.y = scene.guitarPick.y;
        this.setVisible(true);
        this.setActive(true);
    }

    update() {
        this.x += this.moveSpeed;
    }
}

class BulletGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene, config);
    }

    fireBullet(scene) {
        let bullet = this.getFirstDead(
            true,
            scene.guitarPick.x,
            scene.guitarPick.y,
            'guitar-pick',
            );
        if (bullet) {
            bullet.setBullet(scene);
        } 
    }

    resetBullet(scene) {
        for (let i = 0; i < this.getLength(); i++) {
            let child = this.getChildren()[i];
            if (child.x > scene.width + 10) {
                this.killAndHide(child);
            }
        }
    }
}