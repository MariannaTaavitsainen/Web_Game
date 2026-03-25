//In here will be the background-image moving, and the road-image moving stuff

class Background {
    constructor(elementId, speed) {
        this.element = document.getElementById(elementId);
        this.speed = speed;
        this.posX = 0;
    }

    update() {
        this.posX -= 0.5 * this.speed;
        this.element.style.backgroundPosition = `${this.posX}px 0`;
    }
}

class Road {
    constructor(elementId, speed) {
        this.element = document.getElementById(elementId);
        this.speed = speed;
        this.posX = 0;
    }

    update() {
        this.posX -= 1 * this.speed;
        this.element.style.backgroundPosition = `${this.posX}px 0`;
    }
}
const menuRoad = new Road("road", 2);
const menuBackground = new Background("gameSpace", 1);
setInterval(() => menuBackground.update(), 40);
setInterval(() => menuRoad.update(), 40);