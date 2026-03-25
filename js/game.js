class Goat {
    constructor() {
        this.element = document.getElementById("goat");
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.y = 64;                    
        this.verticalSpeed = 0;
        this.isJumping = false;
    }

    start() {
        this.element.style.display = "block";
    }

    jump() {
        if (this.isJumping) return;

        this.isJumping = true;
        const jumpMax = 300;   
        const ground = 64;     
        let goingUp = true;    

        
        const step = () => {
            if (!this.isJumping ) return;

            if (goingUp) {
                this.isJumping = true
                this.y += 10; 
                if (this.y >= jumpMax){
                    goingUp = false;
                } 
            } else {
                this.y -= 10; 
                if (this.y <= ground) {
                    this.y = ground;
                    this.isJumping = false;
                }
            }

            this.element.style.bottom = this.y + "px";

            if (this.isJumping) requestAnimationFrame(step);
        };

        step();
    }
}

class Obstacle {
    constructor(type) {
        this.type = type;
        this.x = 920;   
        this.y = 60;    

        this.element = document.createElement("div");
        this.element.classList.add("obstacle", type);

        if (type === "poop") {
            this.width = 69;
            this.height = 62;
            this.element.style.backgroundImage = "url('assets/img/poop.png')";
        } 
        else if (type === "rock") {
            this.width = 115;
            this.height = 68;
            this.element.style.backgroundImage = "url('assets/img/rock.png')";
        } 
        else if (type === "egg") {
            this.width = 72;
            this.height = 65;
            this.element.style.backgroundImage = "url('assets/img/egg.png')";
        }

        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";

        this.element.style.left = this.x + "px";
        this.element.style.bottom = this.y + "px";

        document.getElementById("gameSpace").appendChild(this.element);
    }

    update(speed) {
        this.x -= speed; 
        this.element.style.left = this.x + "px";
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    remove() {
        this.element.remove();
    }
}

class Game {
    constructor() {
        this.player = null;
        this.obstacles = [];
        this.gameSpeed = 5;
        this.lastSpawnTime = 0;
        this.isRunning = false;
        this.animationFrame = null;

    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.obstacles.forEach(obs => obs.remove()); 
        this.obstacles = [];

        this.player = new Goat();
        this.player.start();

        this.lastSpawnTime = performance.now();

        this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    }


    gameLoop(timestamp) {
        if (!this.isRunning) return;

        if (timestamp - this.lastSpawnTime > 1600 + Math.random() * 700) {
            const types = ["poop", "rock", "egg"];
            const randomType = types[Math.floor(Math.random() * 3)];
            this.obstacles.push(new Obstacle(randomType));
            this.lastSpawnTime = timestamp;
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.update(this.gameSpeed);

            if (obs.isOffScreen()) {
                obs.remove();
                this.obstacles.splice(i, 1);
            }
        }

        this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    }
}

document.addEventListener("keydown", (e) => {
    if (!game || !game.isRunning) return;

    if (e.code === "Space") {
        e.preventDefault();
        game.player.jump();

    }
});