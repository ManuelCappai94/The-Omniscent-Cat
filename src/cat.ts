const catvas = document.getElementById("catvas") as HTMLCanvasElement;
const ctx = catvas.getContext("2d") as CanvasRenderingContext2D;

let animationFrames: number = 0;


abstract class Sprite {
   
    constructor(
        public img: HTMLImageElement,
        public frameX: number,
        public frameY: number,
        public sheetWidth: number,
        public sheetHeight: number,
        public maxFrame: number,
        public spriteFrames: number,
        public spriteWidth: number,
        public spriteHeight: number,
        public isTalking: boolean, //flag per non interrompere l'animazione
        ){}
       abstract getSrc(path:string):void;
       draw(ctx : CanvasRenderingContext2D): void{
        // ctx.clearRect(0, 0, catvas.width, catvas.height)
        ctx.drawImage(
            this.img,
            this.frameX * this.sheetWidth,
            this.frameY * this.sheetHeight,
            this.sheetWidth,
            this.sheetHeight,
            100, //posizione in canvas x
            0, //posizione in canvas y
            this.spriteWidth ,
            this.spriteHeight
        )
        
       }
}

export const enum catState { //questo sarà il valore che passiamo a frameY
    idle = 0,
    headMove = 1,
    tailMove = 2,
    talk = 3,
    pawRight = 4,
    pawLeft = 5
}

export const sounds = {
    purr: new Audio("effects/fusa.mp3"),
    text: new Audio("effects/text.mp3"),
    miagolio: new Audio("effects/miagolio1.mp3"),
    paw: new Audio("effects/paw.mp3"),
    tail: new Audio("effects/tailMove.mp3"),
    purr2: new Audio("effects/fusa2.mp3")
}

function stopAllSounds(): void{
    Object.values(sounds).forEach(audio=> {
        audio.pause();
        audio.currentTime = 0; //per resettare
    })
}


class Cat extends Sprite {
    public staggerFrames: number; //in TS una propiretà va prima dichiarata
    public state: number;
    
    constructor(){//solo valori dinamici
        const img = new Image()
        super(img, 0 , 0 , 64, 64, 6, 0, 200, 200, false) //il super per funzionare deve prendere i valori dalla classe padre o riscivere tutto
        this.staggerFrames = 20 //inizializzo la propietà
        this.state = catState.idle;
    }
    getSrc(path: string):void{
        this.img.src = path
    }
    //chiama il metodo .getBoundingClientRect() per definire hitbox specifiche in canvas
public setupEventListeners(): void { 
        catvas.addEventListener("pointerdown", (e: MouseEvent) => {
            const rect: DOMRect = catvas.getBoundingClientRect() as DOMRect;
            const x: number = e.clientX - rect.left;
            const y:number = e.clientY - rect.top;
            //clientX è una proprietà readonly di mouseEvent
            //.left è una proprietà readonly dell interface DOMRect
            
            if (x >= 100 && x <= 200 && y >= 40 && y <= 120) {
                if(!this.isTalking) { //flag per non interrompere l'animazione
                     this.frameX = 0;
                this.state = catState.headMove;
                sounds.purr.loop = true
                sounds.purr.play()
                }
            } if(x >= 200 && x <= 400 && y >= 40 && y <= 170) {
                if(!this.isTalking){
                      this.frameX =0;
                this.state = catState.tailMove;
                sounds.purr2.loop = true;
                sounds.tail.loop = true;
                sounds.tail.play()
                sounds.purr2.volume = 0.05
                sounds.purr2.play()
                }
            } if(x >= 40 && x <= 130 && y >= 120 && y <= 170) {
                if(!this.isTalking){
                      this.frameX =0;
                this.state = catState.pawRight;
                sounds.paw.loop = true
                sounds.paw.play()
                }
            } if(x >= 140 && x <= 300 && y >= 140 && y <= 200) {
                if(!this.isTalking){
                      this.frameX =0;
                this.state = catState.pawLeft;
                sounds.paw.play()
                sounds.miagolio.loop = true;
                sounds.miagolio.volume = 0.3
                sounds.miagolio.play()
                }
            }
            
        });
        catvas.addEventListener("pointerup", () => {
            // Torna a idle quando rilasci
            this.state = catState.idle;
            stopAllSounds();
         
        });
    }
    animationIdle(): void{
        this.frameY = this.state    
    }

}
export const cat = new Cat()
cat.getSrc("./cat.png")
cat.setupEventListeners()




function animation (): void {
    ctx.clearRect(0, 0, catvas.width, catvas.height) //non serve specificare il type
    
 if(animationFrames % cat.staggerFrames == 0 ){ //stagger frames rallenta
    if (cat.frameX < 5) cat.frameX ++;
    else cat.frameX = 0;
 }

// cat.frameY = cat.state
// cat.updateFrameY()
cat.animationIdle()

 cat.draw(ctx)
  animationFrames++;
    requestAnimationFrame(animation)
}

animation()