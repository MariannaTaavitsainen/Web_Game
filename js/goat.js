class Goat {
    constructor() {
        this.element = document.getElementById("goat");
        this.x = 70;
        this.y = 64;                   
        this.verticalSpeed = 0;
        this.isJumping = false;
        this.jumpSound = new Audio("assets/sounds/goatJump.wav");
        this.jumpSound.preload = "auto";
    }

    start() {
        this.element.style.display = "block";
    }

    jump() {
        if (this.isJumping) return;

        const ground = 64;    
        this.isJumping = true;

        if(settings.soundOn){
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
        }

        const jumpMax = 300;   
        let goingUp = true;    
 
        const step = () => {
            if (!this.isJumping ) return;


            if (goingUp) {
                this.y += 10; 
                if (this.y >= jumpMax){
                    goingUp = false;
                } 
            } else {
                this.y -= 10; 

                if (this.y <= (ground-90)) {
                    this.y = ground;
                    this.isJumping = false;
                }
            }

            this.element.style.bottom = this.y + "px";

            if (this.isJumping){
                requestAnimationFrame(step);
            }       
        };

        step();
    }
        
    getHitArea(){
        const rect = this.element.getBoundingClientRect();
        const gameSpaceRect = document.getElementById("gameSpace").getBoundingClientRect();

        return {
            x: rect.left - gameSpaceRect.left,
            y: rect.bottom - gameSpaceRect.top - rect.height,
            width: rect.width -15,
            height: rect.height -25
        };
    }
}