import { sounds, sprite, stopAllSounds } from "./assets.js";
export const catvas = document.getElementById("catvas");
class Sprite {
    img;
    frameX;
    frameY;
    sheetWidth;
    sheetHeight;
    maxFrame;
    spriteFrames;
    spriteWidth;
    spriteHeight;
    isTalking;
    constructor(img, frameX, frameY, sheetWidth, sheetHeight, maxFrame, spriteFrames, spriteWidth, spriteHeight, isTalking) {
        this.img = img;
        this.frameX = frameX;
        this.frameY = frameY;
        this.sheetWidth = sheetWidth;
        this.sheetHeight = sheetHeight;
        this.maxFrame = maxFrame;
        this.spriteFrames = spriteFrames;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.isTalking = isTalking;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.frameX * this.sheetWidth, this.frameY * this.sheetHeight, this.sheetWidth, this.sheetHeight, 100, //posizione in canvas x
        0, //posizione in canvas y
        this.spriteWidth, this.spriteHeight);
    }
}
export var catState;
(function (catState) {
    catState[catState["idle"] = 0] = "idle";
    catState[catState["headMove"] = 1] = "headMove";
    catState[catState["tailMove"] = 2] = "tailMove";
    catState[catState["talk"] = 3] = "talk";
    catState[catState["pawRight"] = 4] = "pawRight";
    catState[catState["pawLeft"] = 5] = "pawLeft";
})(catState || (catState = {}));
const catHitbox = {
    head: {
        left: 100,
        right: 200,
        top: 40,
        bottom: 120,
    },
    body: {
        left: 200,
        right: 400,
        top: 40,
        bottom: 170,
    },
    pawRight: {
        left: 40,
        right: 130,
        top: 120,
        bottom: 170,
    },
    pawLeft: {
        left: 140,
        right: 300,
        top: 140,
        bottom: 200,
    },
};
export class Cat extends Sprite {
    staggerFrames; //in TS una propiretà va prima dichiarata
    state;
    constructor() {
        super(sprite.cat, 0, 0, 64, 64, 6, 0, 200, 200, false); //il super per funzionare deve prendere i valori dalla classe padre o riscivere tutto
        this.staggerFrames = 20; //inizializzo la propietà
        this.state = catState.idle;
    }
    stateManagment(state, firstSound, volume, secondSound) {
        if (!this.isTalking) {
            this.frameX = 0;
            this.state = state;
            firstSound.loop = true;
            firstSound.volume = volume;
            firstSound.play();
            if (secondSound) {
                secondSound.loop = true;
                secondSound.volume = volume;
                secondSound.play();
            }
        }
    }
    //chiama il metodo .getBoundingClientRect() per definire hitbox specifiche in canvas
    setupEventListeners() {
        catvas.addEventListener("pointerdown", (e) => {
            const rect = catvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            //clientX è una proprietà readonly di mouseEvent
            //.left è una proprietà readonly dell interface DOMRect
            if (x >= catHitbox.head.left && x <= catHitbox.head.right && y >= catHitbox.head.top && y <= catHitbox.head.bottom) {
                this.stateManagment(catState.headMove, sounds.purr, 1);
            }
            if (x >= catHitbox.body.left && x <= catHitbox.body.right && y >= catHitbox.body.top && y <= catHitbox.body.bottom) {
                this.stateManagment(catState.tailMove, sounds.purr2, 0.10, sounds.tail);
            }
            if (x >= catHitbox.pawRight.left && x <= catHitbox.pawRight.right && y >= catHitbox.pawRight.top && y <= catHitbox.pawRight.bottom) {
                this.stateManagment(catState.pawRight, sounds.paw, 1);
            }
            if (x >= catHitbox.pawLeft.left && x <= catHitbox.pawLeft.right && y >= catHitbox.pawLeft.top && y <= catHitbox.pawLeft.bottom) {
                this.stateManagment(catState.pawLeft, sounds.paw, 0.25, sounds.miagolio);
            }
        });
        catvas.addEventListener("pointerup", () => {
            // Torna a idle quando rilasci
            this.state = catState.idle;
            stopAllSounds();
        });
    }
    animationIdle() {
        this.frameY = this.state;
    }
}
