   
   
       public spriteAnimation:  { [key: string]: { loc: { x: number; y: number }[] } } = {}; 
    //non serve dichiarare i tipi che conterra l'array, i valori tipizzati sono dichiarati dall'interfaccia
    public animationStates : states[] = [
        { name: "idle",
            frames : 6,
        },
        { 
        name : "testa",
        frames : 6,
        },
        {
        name: "coda",
        frames : 6,
        },
        {
        name: "parla",
        frames : 6, 
        }
    ]
   
   
   
   
   
   pushAnimation(): void {
        this.animationStates.forEach((state, index)=> {
            let frames:{ loc: { x: number; y: number }[]} = { //serve solo come variabile intermedia
                loc:[] // gli states, loc va dichiararo in maniera molto esplicità
            } 
            for(let j=0; j<state.frames; j++){ //accedo ai singoli valori dell'array
                let positionX: number = j* this.sheetWidth;
                let positionY: number = index * this.sheetWidth; // 0, 1 ,2 
                frames.loc.push({ x: positionX, y: positionY}) // x e y sono arbitrari l'importante è che siano coerenti con la struttura dell'array
            }
            this.spriteAnimation[state.name] = frames
        })
    }


      if (cat.state === catState.idle && animationFrames % 200 === 0){
            cat.frameY = Math.floor(Math.random()*4 as catState) 
        } 