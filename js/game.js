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

        if(settings.soundOn){
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
        }
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

class Highscores {
    constructor() {
        this.key = "goatGameHighscores";
        this.maxScores = 10;
    }

    getAll() {
        const saved = localStorage.getItem(this.key);
        return saved ? JSON.parse(saved) : [];
    }

    saveNew(score) {
    const highscoresArea = document.getElementById("highscoresArea");
    highscoresArea.style.display = "none";

    const addDiv = document.getElementById("addNewHighscore");
    addDiv.style.display = "block";

    const saveButton = addDiv.querySelector("#saveHighscorebtn");
    const nameInput = addDiv.querySelector("input");



    return new Promise((resolve) => {
        saveButton.onclick = () => {
            const playerName = nameInput.value.trim() || "Anonym";

            let scores = this.getAll();
            scores.push({
                name: playerName,
                score: score,
                date: new Date().toLocaleDateString()
            });

            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, this.maxScores);
            localStorage.setItem(this.key, JSON.stringify(scores));


            addDiv.style.display = "none";
            nameInput.value = "";

            highscoresArea.style.display = "block";
            this.render();

            resolve(scores);
        };
    });
}

    render() {
        const tbody = document.getElementById("highscoreList");
        tbody.innerHTML = "";

        const scores = this.getAll();

        if (scores.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3">Earn at least 10 points and start filling the highscore list!</td></tr>`;
            return;
        }

        scores.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}.</td>
                <td> ${entry.name}</td>
                <td> ${entry.score}</td>
            `;
            tbody.appendChild(row);
        });
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

        this.runMusic = new Audio("assets/sounds/runMusic.mp3");
        this.runMusic.loop = true;
        this.runMusic.preload = "auto";
    
    }

    start(){
        if (this.isRunning) return;

        if(settings.musicOn){
        this.runMusic.currentTime = 0;
        this.runMusic.play();
        }

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

    stopMusic() {
        if (this.runMusic) {
            this.runMusic.pause();
            this.runMusic.currentTime = 0;
        }
    }

    gameOver(){
        this.isRunning = false;

        if(settings.soundOn){
        this.hitSound.currentTime = 0;
        this.hitSound.play();
        }

        this.stopMusic();

        cancelAnimationFrame(this.animationFrame);

        this.obstacles.forEach(obs => obs.remove()); 

        if (this.Goat) this.Goat.element.style.display = "none";

        const finalScore = this.points.points;

        const highscores = new Highscores();

        const currentScores = highscores.getAll();
        const minHighscore = currentScores.length < highscores.maxScores 
            ? 0 
            : currentScores[currentScores.length - 1].score;

        // Näytetään highscores-näkymä aina game overissa
        const highscoresArea = document.getElementById("highscoresArea");
        highscoresArea.style.display = "block";

        if (finalScore > minHighscore) {
            highscores.saveNew(finalScore);
        } else {
            highscores.render();
        }
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