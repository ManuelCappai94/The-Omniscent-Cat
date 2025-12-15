import { Cat, catvas  } from "./cat.js";

const ctx = catvas.getContext("2d") as CanvasRenderingContext2D;
let animationFrames: number = 0; //non è necessario dichiarare il type qua


export const cat = new Cat()

cat.setupEventListeners()




function animation (): void {
    ctx.clearRect(0, 0, catvas.width, catvas.height) //non serve specificare il type
    
 if(animationFrames % cat.staggerFrames == 0 ){ //stagger frames rallenta
    if (cat.frameX < 5) cat.frameX ++;
    else cat.frameX = 0;
 }

cat.animationIdle()

 cat.draw(ctx)
  animationFrames++;
    requestAnimationFrame(animation)
}

animation()