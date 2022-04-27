// The PowerUps class contains the many scene(state) changes that can occur while in Play

class PowerUp {
    constructor(name) {

        this.name = name; // name of powerup
        this.PU_timer; // timer used for powerup duration
    }

    revertScene(scene) {
        scene = this.prevState;
    }
}

// Makes the pick invinsible from negative effects and
// increases the speed of the scene scrolling
class Invincible extends PowerUp {
    constructor(name) {
        super(name);
        
        this.PU_scrollSpeed = 2; // will add this value to the scene's scrollSpeed
        this.PU_isInv = true; // will change guitar pick to run through bad notes without penalty
    }

    modifyScene(pick, scene) {
        console.log('invincibility')
        scene.scrollSpeed += this.PU_scrollSpeed;
        pick.isInv = this.PU_isInv;
        scene.PU_timer = scene.time.addEvent({
            callback: () => {
                console.log('End pu');
                scene.scrollSpeed -= this.PU_scrollSpeed;
                pick.isInv = !pick.isInv;
                scene.PU_active = false;
            },
            callbackScope: scene,
            delay: 5000
        })
    }
}