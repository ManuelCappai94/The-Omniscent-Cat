import "./cat.js"
import { cat, catState, sounds} from "./cat.js"

const rightBtn: Element | null = document.getElementById("api-facts")
const leftBtn: Element | null = document.getElementById("api-funny")
const textArea: Element | null = document.querySelector(".answer")

const categories:string[] = ["animal","career","celebrity","dev","fashion","food","history","money","movie","music","political","science","sport","travel"]

// const URLRight: string  ="https://catfact.ninja/fact?max_length=100"
// const URLLeft: string  =`https://api.chucknorris.io/jokes/random?category=${filter}`
//ho spostato l'url, assieme al math Random dentro all'event listener cosi da aggiornare il valore random ogni volta

rightBtn?.addEventListener("click", () => {
    if(cat.isTalking) return
    cat.isTalking = true
    fetchUrls("https://catfact.ninja/fact?max_length=100", "cat") 
    //ho aggiunto "cat" perchè : fetchUrls(url: string, type: "cat" | "chuck")
    cat.isTalking = false
})
leftBtn?.addEventListener("click", () => {
     if(cat.isTalking) return
    cat.isTalking = true
    const filter: (string|undefined) = categories[Math.floor(Math.random()*categories.length)];
    fetchUrls(`https://api.chucknorris.io/jokes/random?category=${filter}`, "chuck")
    cat.isTalking = false
})

console.log(cat.isTalking)
interface Facts {
    fact:string;
    value:string;
}

// Funzione sleep per await
function sleep(ms: number){ //questo sarà il ritardo tra le lettere
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function displayData(text: string | undefined, delay: number = 50){
    textArea!.textContent = "";
    for (let i = 0; i< text!.length;  i++){
        textArea!.textContent += text![i]
        cat.isTalking = true; //flag per non interrompere l'animazione
        cat.state = catState.talk
        sounds.text.play()
        await sleep(delay)
        if( textArea!.textContent.length === text!.length) {
            cat.state = catState.idle
            cat.isTalking = false;
            sounds.text.pause();
            sounds.text.currentTime = 0;
        }
         //questo if funziona perchè uno calcola il valore per ogni immessione, l'altro e la grandezza predefinita
    }
}
//prima tipizzo gli array in cui inserisco i dati presi dal local storage
interface CacheData {
   catFacts: string[];
   chuckNorris: string[]; //perchè la chiamata si avvale di stringa + categoria
}

//funzione per evitare duplicati nella cache
function addnewItem( cache: string[], newFact: string, storagekey: string){
    if(!cache.includes(newFact)){
        cache.push(newFact)
            localStorage.setItem(storagekey, JSON.stringify(cache))
    }
}
//let è il tipo dell'interfaccia
let cache: CacheData = {
    catFacts: [],
    chuckNorris: [],
}

const storedCatFacts: (string |null) =  localStorage.getItem("catFacts");
const storedChuck: (string |null) = localStorage.getItem("chuckNorris");

if (storedCatFacts) cache.catFacts = JSON.parse(storedCatFacts);
if (storedChuck) cache.chuckNorris = JSON.parse(storedChuck);

// aggiungo i type cat e chuck su consiglio di chatgpt, per effettuare il controllo in caso di chiamata fallita

async function fetchUrls(url: string, type: "cat" | "chuck"): Promise<void> {
    try{
        const data: Response = await fetch(url);
        const response: Facts = await data.json();
        const textToDisplay = response.fact || response.value || "";
        //localstorage
    if (type === "cat" && response.fact) {
     addnewItem(cache.catFacts, response.fact, "catFacts")
    }
    if (type === "chuck" && response.value) {
        addnewItem(cache.chuckNorris, response.value, "chuckNorris")
    }
        await displayData(textToDisplay, 40)
    } catch(error){
        console.log(error)
        if (type === "cat" && cache.catFacts.length > 0) {
            displayData(cache.catFacts[Math.floor(Math.random()*cache.catFacts.length)], 40)
        }
        if (type === "chuck" && cache.chuckNorris.length > 0) {
            displayData(cache.chuckNorris[Math.floor(Math.random()*cache.chuckNorris.length)], 40);
    }
    }
}

window.addEventListener("keyup", (e)=>{
    if(e.key === "p") localStorage.clear()
})


