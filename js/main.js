
function startGame() {
  window.location.href = "game.html";
}

function openSettings() {
  alert("Settings coming soon!");
}

function showHighscores() {
  alert("Highscores coming soon!");
}

let gameSpeed = 1;

let bgLocX = 0;
let roadLocX = 0;

function moveBackground(speed) { //Siirretään tämä background.js:n mikäli tulee käyttöön
    bgLocX -= 0.5 * speed;

    document.getElementById("gameSpace").style.backgroundPosition = bgLocX + "px 0";
}

function moveRoad(speed){
    roadLocX -= 1 * speed;
    document.getElementById("road").style.backgroundPosition = roadLocX + "px 0";

}

function gameLoop() {
    moveBackground(gameSpeed);
    moveRoad(gameSpeed)
    
}


setInterval(gameLoop, 40);


//Siirretään tämä game.js:n, kun toimii
let frame = 1;
let direction = 1;

function goatRuns() {
    const img = document.getElementById("goatImg");
    img.src = "assets/img/run" + frame + ".png";  

    frame += direction;
    if (frame === 4){
        direction = -1;   
    }if (frame === 1){ 
        direction = 1;
    }
    /*frame = frame +1;
    if (frame>4){
        frame = 1;
    }*/
}

setInterval(goatRuns, 350);