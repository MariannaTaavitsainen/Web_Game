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