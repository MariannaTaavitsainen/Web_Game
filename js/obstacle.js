
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