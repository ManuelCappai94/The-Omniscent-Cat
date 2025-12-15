// in tS è un errore vole per forza tipizzare ogni cosa, ts è abbastanza intelligente da capire che questi newAudio sono HTMLAudioElements, lo stesso vale per lo sprite in teoria definirlo cosi è rindondnate, anche se quadno passi dati tra moduli dovrebbe essere una scelta corretta.

 type Sound = {
    purr: HTMLAudioElement,
    text:  HTMLAudioElement,
    miagolio:  HTMLAudioElement,
    paw:  HTMLAudioElement,
    tail:  HTMLAudioElement,
    purr2:  HTMLAudioElement,
}


export const sounds : Sound = {
    purr: new Audio("assets/effects/fusa.mp3"),
    text: new Audio("assets/effects/text.mp3"),
    miagolio: new Audio("assets/effects/miagolio1.mp3"),
    paw: new Audio("assets/effects/paw.mp3"),
    tail: new Audio("assets/effects/tailMove.mp3"),
    purr2: new Audio("assets/effects/fusa2.mp3")
}

export function stopAllSounds(): void{
    Object.values(sounds).forEach(audio=> {
        audio.pause();
        audio.currentTime = 0; //per resettare
    })
}

//questo in futuro potrebbe contenere nuovi Sprite 
type Sprite = {
    cat : HTMLImageElement
}
//sto valutando di creare una funziona che si occupi di prendere tutti gli sprite e farli ritornare come HTMLImageElement, cosi potrei liberarmi di type Sprite e non dover scrivere per ogni sprite il src, o duplicare il metodo all'interno di ogni sprite
export const sprite: Sprite = {
    cat : new Image()
}

sprite.cat.src =  "assets/cat.png"