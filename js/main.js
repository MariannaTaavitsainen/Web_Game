let game = null;   // Täällä pidetään kirjaa pelistä

function startGame() {
    // Jos peli on jo käynnissä, älä tee mitään
    if (game && game.isRunning) return;

    // Piilota aloitusvalikko
    document.getElementById("menuButtons").style.display = "none";

    // Luo uusi peli ja käynnistä se
    game = new Game();
    game.start();
}

// Asetukset ja highscore (voit täyttää myöhemmin)
function openSettings() {
    alert("Asetukset tulevat pian! 🛠️");
}

function showHighscores() {
    alert("Ennätykset tulevat pian! 🏆");
}
