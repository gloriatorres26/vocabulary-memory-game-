const board = document.getElementById("gameBoard");

let musicVolume = 0.02;
let voiceVolume = 1;
let effectsVolume = 0.5

const maxPairs = 12;

let usedWords = [];

// lista de palabras basada en tus imágenes
const words = [
  "apple",
  "arm",
  "bathroom",
  "cat",
  "frog",
  "hall",
  "head",
  "horse",
  "notebook",
  "tree",
  "blue",
  "cap",
  "ear",
  "gloves",
  "green",
  "hand",
  "jacket",
  "legs",
  "nose",
  "orange",
  "pants",
  "purple",
  "red",
  "sack",
  "shoulder",
  "socks",
  "tennis",
  "torso",
  "t-shirt",
  "yellow"
];

let cards = [];

function generateCards() {

  cards = [];

  // 🆕 palabras que aún NO han salido
  let unusedWords = words.filter(word => !usedWords.includes(word));

  // ♻️ si ya usamos todas, reiniciar memoria
  if (unusedWords.length < maxPairs) {
    usedWords = [];
    unusedWords = [...words];
  }

  // 🔀 mezclar palabras nuevas
  unusedWords.sort(() => Math.random() - 0.5);

  // 🎯 escoger algunas
  const selectedWords = unusedWords.slice(0, maxPairs);

  // 💾 guardar como usadas
  usedWords.push(...selectedWords);

  // 🔤 crear cartas
  selectedWords.forEach(word => {

    // 🖼️ imagen
    cards.push({
      type: word,
      mode: "image",
      content: `<img src="img/${word}.png">`
    });

    // 🔤 palabra
    cards.push({
      type: word,
      mode: "text",
      content: word.charAt(0).toUpperCase() + word.slice(1)
    });

  });

  // 🔀 mezclar cartas
  cards.sort(() => Math.random() - 0.5);
}

let firstCard = null;
let secondCard = null;
let lock = false;
let matches = 0;
const totalMatches = words.length;


function createBoard() {

  generateCards();

  matches = 0;

  shuffleCards(); // 👈 aquí

  board.innerHTML = "";

  cards.forEach((cardData) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${cardData.content}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card, cardData));

    board.appendChild(card);
  });
}

function flipCard(card, data) {
  if (lock || card.classList.contains("flip")) return;

playSound("flip");

  card.classList.add("flip");

  // 🔊 reproducir sonido SIEMPRE (imagen o palabra)
if (data.mode === "text") {
  speak(data.type);
}

  if (!firstCard) {
    firstCard = { card, data };
  } else {
    secondCard = { card, data };
    checkMatch();
  }
}
function checkMatch() {
  lock = true;

  if (firstCard.data.type === secondCard.data.type) {

    playSound("match"); // 🔊 sonido al acertar

    matches++; // ➕ contar aciertos

    if (matches === totalMatches) {
      setTimeout(() => {
        playSound("win"); // 🎉 sonido de victoria
        alert("🎉 ¡Ganaste!");
      }, 500);
    }

    resetTurn();

  } else {
    setTimeout(() => {
      firstCard.card.classList.remove("flip");
      secondCard.card.classList.remove("flip");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function shuffleCards() {
  cards = cards.sort(() => Math.random() - 0.5);
}

function speak(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; // inglés
  utterance.rate = 0.9; // velocidad (opcional)
  utterance.pitch = 1;
  utterance.volume = voiceVolume;

  speechSynthesis.speak(utterance);
}

function playSound(name) {

  const audio = new Audio(`audio/${name}.mp3`);

  audio.volume = effectsVolume;

  audio.currentTime = 0;

  audio.play();
}

shuffleCards();
createBoard(); 

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = musicVolume;

document.addEventListener("click", () => {
  bgMusic.play();
}, { once: true });

const musicSlider = document.getElementById("musicVolume");
const voiceSlider = document.getElementById("voiceVolume");
const effectsSlider = document.getElementById("effectsVolume");

musicSlider.addEventListener("input", () => {

  musicVolume = parseFloat(musicSlider.value);

  bgMusic.volume = musicVolume;
});

voiceSlider.addEventListener("input", () => {

  voiceVolume = parseFloat(voiceSlider.value);
});

effectsSlider.addEventListener("input", () => {

  effectsVolume = parseFloat(effectsSlider.value);
});
