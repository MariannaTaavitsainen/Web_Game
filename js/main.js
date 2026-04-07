class Settings {
    constructor() {
        this.musicOn = true;
        this.soundOn = true;

        this.musicButton = document.getElementById("musicButton");
        this.soundsButton = document.getElementById("soundsButton");

        if (this.musicButton) {
            this.musicButton.textContent = "Music: ON";
            this.musicButton.addEventListener("click", () => {
                this.musicOn = !this.musicOn;
                this.musicButton.textContent = "Music: " + (this.musicOn ? "ON" : "OFF");
            });
        }

        if (this.soundsButton) {
            this.soundsButton.textContent = "Sounds: ON";
            this.soundsButton.addEventListener("click", () => {
                this.soundOn = !this.soundOn;
                this.soundsButton.textContent = "Sounds: " + (this.soundOn ? "ON" : "OFF");
            });
        }
    }
}


let game = null;
const settings = new Settings();


function openSettings() {
    document.getElementById("settingsMenu").style.display = "block";
    document.getElementById("menuButtons").style.display = "none";
}

function closeSettings() {
    document.getElementById("settingsMenu").style.display = "none";
    document.getElementById("menuButtons").style.display = "block";
}

function showHighscores() {
    document.getElementById("menuButtons").style.display = "none";
    document.getElementById("head").style.display="none";
    
    const highscoresArea = document.getElementById("highscoresArea");
    highscoresArea.style.display = "block";


    const highscores = new Highscores();  
    highscores.render();
}

document.getElementById("backToMenuBtn").addEventListener("click", () => {
    document.getElementById("highscoresArea").style.display = "none";
    document.getElementById("menuButtons").style.display = "block";
    document.getElementById("points").style.display = "none";
    document.getElementById("head").style.display="block";
});

document.getElementById("playAgainBtn").addEventListener("click", () => {
    document.getElementById("highscoresArea").style.display = "none";
    document.getElementById("menuButtons").style.display = "none";
    startGame();
});


function startGame() {
    if (game && game.isRunning) return;

    document.getElementById("menuButtons").style.display = "none";
    document.getElementById("settingsMenu").style.display = "none";
    document.getElementById("head").style.display="none";

    game = new Game();
    game.start();
}