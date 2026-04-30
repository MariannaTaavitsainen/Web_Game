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

        let minSpawnTime = 2000;   
        let maxSpawnTime = 4000;

        if (this.points.points % 40 === 0 && this.points.points > 0 && this.points.points < 510){
        const levels = this.points.points / 100;        
        minSpawnTime = 2000 * Math.pow(0.8, levels);    
        maxSpawnTime = 4000 * Math.pow(0.85, levels);
        }

        if (timestamp - this.lastSpawnTime > minSpawnTime + Math.random() * (maxSpawnTime - minSpawnTime)) {
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