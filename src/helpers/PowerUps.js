// The PowerUps class contains the many scene(state) changes that can occur while in Play

class PowerUps {
    constructor(name) {

        this.name = name; // name of powerup
        this.prevState; // will hold scene state prior to powerup trigger
    }

    revertScene(scene) {
        scene = this.prevState;
    }
}

class Invincible extends PowerUps {
    constructor(name) {
        super(name);
        
        this.PU_scrollSpeed = 1; // will add this value to the scene's scrollSpeed
        this.PU_isInv = true; // will change guitar pick to run through bad notes without penalty
    }

    modifyScene(pick, scene) {
        this.prevState = scene;
        scene.scrollSpeed += this.PU_scrollSpeed;
        pick.isInv = this.PU_isInv;
        
    }
}