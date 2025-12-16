import { displayData } from "./index.js";
let cache = {
    catFacts: [],
    chuckNorris: [],
};
//funzione per evitare duplicati nella cache
function addnewItem(cache, newFact, storagekey) {
    if (!cache.includes(newFact)) {
        cache.push(newFact);
        localStorage.setItem(storagekey, JSON.stringify(cache));
    }
}
const storedCatFacts = localStorage.getItem("catFacts");
const storedChuck = localStorage.getItem("chuckNorris");
//il parse mi serve farlo qua cosi a displayData passo il dato pronto
if (storedCatFacts)
    cache.catFacts = JSON.parse(storedCatFacts);
if (storedChuck)
    cache.chuckNorris = JSON.parse(storedChuck);
//al momento nel codice esiste una dipendenza circolare, causata dal fatto che dopo il refactor mi sono ritovato ad importare displayData anche in questo modulo, l'unico motivo per cui tutto non escplode è perchè fetchUrl è una promise, quindi "ruba il turno" diciamo. 
//la soluzione potrebbe essere cancellerare i display data da fetchurl, cosi essa non gestisce anche UI ma solo le stringhe che riceve. Mentre a displayData non importa se gli arriva della cache o la risposta immediata, deve solo mostrare testo a schermo.
//quindi obiettivo, far ritornare le stringhe a fetchUrl, passaere queste stringhe a displayData
//serve una nuova funzione che gestisce il tutto.
export async function fetchUrls(url, type) {
    try {
        const data = await fetch(url);
        const response = await data.json();
        const textToDisplay = response.fact || response.value || "";
        //localstorage
        if (type === "cat" && response.fact) {
            addnewItem(cache.catFacts, response.fact, "catFacts");
        }
        if (type === "chuck" && response.value) {
            addnewItem(cache.chuckNorris, response.value, "chuckNorris");
        }
        await displayData(textToDisplay, 40);
    }
    catch (error) {
        console.log(error);
        if (type === "cat" && cache.catFacts.length > 0) {
            displayData(cache.catFacts[Math.floor(Math.random() * cache.catFacts.length)], 40);
        }
        if (type === "chuck" && cache.chuckNorris.length > 0) {
            displayData(cache.chuckNorris[Math.floor(Math.random() * cache.chuckNorris.length)], 40);
        }
    }
}
