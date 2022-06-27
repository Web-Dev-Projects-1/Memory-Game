const cards = document.querySelectorAll(".card");
let score = 0;
let fails = 0;
let gameStarted = false;
startGame();

/* FUNCTION TO ATTACH A CLICK LISTENER TO EACH CARD */
for (let i = 0; i < cards.length; i++) {
  /* open the card if clicked */
  cards[i].addEventListener("click", () => {
    cards[i].style.transform = "rotateY(0deg)";
    cards[i].dataset.state = "0"; /* state = 0 card open, state = 1 card closed */
  });
}

/* GAME START */
function startGame() {
  /* if game has not started, no flipping animation for creating cards */
  if (!gameStarted) {
    createCards();
    gameStarted = true;
  } else {
    cards.forEach((e) => {
      e.style.transform = "rotateY(90deg)";
    });
    setTimeout(createCards, 800);
    cards.forEach((e) => {
      setTimeout(() => {
        e.style.transform = "rotateY(0deg)";
      }, 800);
    });
  }
  setTimeout(hideCards, 5000);
}

/* HIDING CARDS */
function hideCards() {
  /* hide the cards by turning them over */
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.transform = "rotateY(180deg)";
    cards[i].dataset.state = "1";
  }
  gameLoop();
}

/* GAME LOOP */
function gameLoop() {
  const interval = setInterval(() => {
    /* create two dictionaries to keep track of true animal counts and selected animal counts */
    let trueAnimalCounts = {};
    let selectedAnimalCounts = {};

    for (let i = 0; i < cards.length; i++) {
      let animal = cards[i].dataset.animal;
      trueAnimalCounts[animal] = (trueAnimalCounts[animal] || 0) + 1;
      if (cards[i].dataset.state === "0") {
        selectedAnimalCounts[animal] = (selectedAnimalCounts[animal] || 0) + 1;
      }
    }

    if (Object.keys(selectedAnimalCounts).length > 1) {
      /* if more than one animal is selected, and the selected and true counts do not coincide for more than one element (curently being chosen), then the player lost */
      let countOff = 0;

      for (let animal in selectedAnimalCounts) {
        countOff += selectedAnimalCounts[animal] != trueAnimalCounts[animal];
      }

      if (countOff > 1) {
        fails += 1;
        updateStats();
        alert("You lost!");
        clearInterval(interval);
        setTimeout(startGame, 2000);
      }
    }

    /* check if player won (all cards are flipper over) */
    let allCardsFlipped = true;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].dataset.state != "0") {
        allCardsFlipped = false;
      }
    }
    if (allCardsFlipped) {
      score += 1;
      updateStats();
      alert("You won!");
      clearInterval(interval);
      setTimeout(startGame, 2000);
    }
  }, 200);
}

/* SCORE AND FAILS UPDATER */
function updateStats() {
  document.querySelector("#score").innerText = score;
  document.querySelector("#fails").innerText = fails;
}

/* UTILITY */
function pickRandomFromArray(array) {
  let max = array.length - 1;
  let randomNum = Math.floor(Math.random() * (max + 1));
  return array[randomNum];
}

function excludeFromArray(array, index) {
  array.splice(index, 1);
  return array;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* CREATING CARDS */
function createCards() {
  let animals = ["yak", "squirrel", "cat", "shark", "dolphin", "eagle", "fish", "ant"];
  let animalsPicked = [];

  for (let i = 0; i < cards.length / 2; i++) {
    /* pick random animals */
    let res = pickRandomFromArray(animals);
    for (let j = 0; j < 2; j++) {
      animalsPicked.push(res);
    }
    animals = excludeFromArray(animals, animals.indexOf(res));
  }

  shuffleArray(animalsPicked);

  /* assign the randomly selected animals to cards */
  for (let i = 0; i < animalsPicked.length; i++) {
    document.querySelector("#img" + String(i + 1)).src = "images/" + animalsPicked[i] + ".jpg";
    document.querySelector("#card" + String(i + 1)).dataset.animal =
      "images/" + animalsPicked[i] + ".jpg";
  }
}
