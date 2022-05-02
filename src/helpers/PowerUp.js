// The PowerUps class contains the many scene(state) changes that can occur while in Play

class PowerUp {
    constructor(name, scrollSpeed, duration) {

        this.name = name; // name of powerup
        this.PU_scrollSpeed = scrollSpeed; // will add this value to the scene's scrollSpeed
        this.duration = duration; // length of time the powerup is active
    }

    revertScene(scene) {
        scene = this.prevState;
    }
}

// Makes the pick invincible from negative effects and
// increases the speed of the scene scrolling for 5 seconds
class Invincible extends PowerUp {
    constructor(name, scrollSpeed, duration) {
        super(name, scrollSpeed, duration);
        this.PU_isInv = true; // will change guitar pick to run through bad notes without penalty
    }

    modifyScene(pick, scene) {
        console.log('invincibility');
        scene.scrollSpeed += this.PU_scrollSpeed;
        pick.isInv = this.PU_isInv;
        scene.PU_timer = scene.time.addEvent({
            callback: () => {
                console.log('End inv');
                scene.scrollSpeed -= this.PU_scrollSpeed;
                pick.isInv = !pick.isInv;
                scene.PU_active = false;
            },
            callbackScope: scene,
            delay: this.duration
        })
    }
}

// Pick can now shoot smaller picks to destroy bad (and good) notes
class Shooter extends PowerUp {
    constructor(name, scrollSpeed, duration) {
        super(name, scrollSpeed, duration);
        this.PU_isInv = false; // will change guitar pick to run through bad notes without penalty
    }

    modifyScene(pick, scene) {
        console.log('shooter');
        pick.SP_active = true;
        scene.PU_timer = scene.time.addEvent({
            callback: () => {
                console.log('End shooter');
                scene.PU_active = false;
                pick.SP_active = false;
            },
            callbackScope: scene,
            delay: this.duration
        })
    }
}

// Pick can now shoot smaller picks to destroy bad (and good) notes
class DblSpeed extends PowerUp {
    constructor(name, scrollSpeed, duration) {
        super(name, scrollSpeed, duration);
        this.PU_isInv = false; // will change guitar pick to run through bad notes without penalty
        this.PU_scrollSpeed = scrollSpeed;
    }

    modifyScene(pick, scene) {
        console.log('double speed');
        scene.scrollSpeed += this.PU_scrollSpeed;
        scene.PU_timer = scene.time.addEvent({
            callback: () => {
                console.log('End double speed');
                scene.scrollSpeed -= this.PU_scrollSpeed;
                scene.PU_active = false;
            },
            callbackScope: scene,
            delay: this.duration
        })
    }
}