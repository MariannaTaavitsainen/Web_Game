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