import "./cat.js";
import { catState, catvas } from "./cat.js";
import { sounds } from "./assets.js";
import { cat } from "./animation.js";
import { fetchUrls } from "./fetch.js";
const rightBtn = document.getElementById("api-facts");
const leftBtn = document.getElementById("api-funny");
const textArea = document.querySelector(".answer");
const categories = ["animal", "career", "celebrity", "dev", "fashion", "food", "history", "money", "movie", "music", "political", "science", "sport", "travel"];
function talkingCat(url, type) {
    if (cat.isTalking)
        return;
    cat.isTalking = true;
    catvas.classList.add("disabled");
    fetchUrls(url, type);
    //  cat.isTalking = false
}
rightBtn?.addEventListener("click", () => {
    talkingCat("https://catfact.ninja/fact?max_length=100", "cat");
});
leftBtn?.addEventListener("click", () => {
    const filter = categories[Math.floor(Math.random() * categories.length)];
    talkingCat(`https://api.chucknorris.io/jokes/random?category=${filter}`, "chuck");
});
// Funzione sleep per await
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function displayData(text, delay = 50) {
    textArea.textContent = "";
    for (let i = 0; i < text.length; i++) {
        textArea.textContent += text[i];
        cat.state = catState.talk;
        sounds.text.play();
        await sleep(delay);
        if (textArea.textContent.length === text.length) {
            cat.state = catState.idle;
            cat.isTalking = false;
            catvas.classList.remove("disabled");
            sounds.text.pause();
            sounds.text.currentTime = 0;
        }
        //questo if funziona perchè il primo elemento all'interno calcosa il testo ad ogni carattere iniettato nel textArea, fino al suo massimo. mentre text.lenght perchè  è direttamente il massimo
    }
}
