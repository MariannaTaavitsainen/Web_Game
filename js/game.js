class Goat {
    constructor() {
        this.element = document.getElementById("goat");
        this.x = 70;
        this.y = 75;                    
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

        this.isJumping = true;

        this.jumpSound.currentTime = 0;
        this.jumpSound.play().catch(err => console.warn("Audio ei toimi:", err));
        const jumpMax = 300;   
        const ground = 64;     
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
                if (this.y <= ground) {
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




class Obstacle {
    constructor(type){
        this.type = type;
        this.x = 920;   
        this.y = 60;    

        this.element = document.createElement("div");
        this.element.classList.add("obstacle", type);
        
        document.getElementById("gameSpace").appendChild(this.element);

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;

        this.element.style.left = this.x + "px";
        this.element.style.bottom = this.y + "px";
    }

    getHitArea(){
    const rect = this.element.getBoundingClientRect();
    const gameSpaceRect = document.getElementById("gameSpace").getBoundingClientRect();

    return {
        x: rect.left - gameSpaceRect.left,                  
        y: rect.bottom - gameSpaceRect.top - rect.height,  
        width: rect.width -30,                                  
        height: rect.height -10
    };
}


    update(speed){
        this.x -= speed; 
        this.element.style.left = this.x + "px";
    }

    isOffScreen(){
        return this.x + this.width < 0;
    }

    remove(){
        this.element.remove();
    }
}

class Points{
    constructor(elementId){
        this.points = 0;
        this.element = document.getElementById(elementId);
    }

    reset(){
        this.points = 0;
        this.updateDisplay();
    }

    add(amount) {
        this.points += amount;
        this.updateDisplay();
    }

    updateDisplay() {
        this.element.textContent = this.points;
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }
}

class Game {
    constructor(){
        this.Goat = null;
        this.obstacles = [];
        this.gameSpeed = 5;
        this.lastSpawnTime = 0;
        this.isRunning = false;
        this.animationFrame = null;  
        this.points = new Points("points");    
        this.hitSound = new Audio("assets/sounds/hitSound.mpeg");
        this.hitSound.preload = "auto";
 
    }

    start(){
        if (this.isRunning) return;

        this.isRunning = true;

        this.obstacles.forEach(obs => obs.remove()); 
        this.obstacles = [];

        this.Goat = new Goat();
        this.Goat.start();

        this.points.reset();
        this.points.show();

        this.lastSpawnTime = performance.now();

        this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    }

    checkCrash(a,b){
        return(
            a.x < b.x + b.width && a.x + a.width > b.x &&
            a.y < b.y + b.height && a.y + a.height > b.y
        );
    }



    gameOver(){
        this.isRunning = false;

        this.hitSound.currentTime = 0;
        this.hitSound.play().catch(err => console.warn("Audio ei toimi:", err));

        cancelAnimationFrame(this.animationFrame);

        this.obstacles.forEach(obs => obs.remove()); 

        if (this.Goat) this.Goat.element.style.display = "none";
        alert("Game over!");
    }


    gameLoop(timestamp){
        if (!this.isRunning) return;

        if (timestamp - this.lastSpawnTime > 1600 + Math.random() * 700) {
            const types = ["poop", "rock", "egg"];
            const randomType = types[Math.floor(Math.random() * 3)];
            this.obstacles.push(new Obstacle(randomType));
            this.lastSpawnTime = timestamp;
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.update(this.gameSpeed);

            const goatBox = this.Goat.getHitArea();
            const obstacleBox = obstacle.getHitArea();

            console.log("Goat:", goatBox.x, goatBox.y, goatBox.width, goatBox.height);
            console.log("Obstacle:", obstacleBox.x, obstacleBox.y, obstacleBox.width, obstacleBox.height);

            if(this.checkCrash(goatBox, obstacleBox)){
                this.gameOver();
                return;
            }

            if (obstacle.isOffScreen()) {
                obstacle.remove();
                this.obstacles.splice(i, 1);
                this.points.add(10);
            }
        }

        this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    }


}



document.addEventListener("keydown", (e) =>{
    if (!game || !game.isRunning) return;

    if (e.code === "Space") {
        e.preventDefault();
        game.Goat.jump();

    }
});