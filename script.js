// document elements
const startCard = document.getElementById("start-card");
const endCard = document.getElementById("end-card");
const cardContainer = document.getElementById("card-container");
//operator
const operationButtons = document.querySelectorAll("#operator");
//menu bar
const newGame = document.getElementById("newGame");
const resetGame = document.getElementById("resetGame");
const leveContainer = document.getElementById("level-container");
// alert S/F
const successAlert = document.getElementById("success-alert");
const failAlert = document.getElementById("fail-alert");
const errorAlert = document.getElementById("error-alert");
//modeal
let modal = document.getElementById("help-modal");
let btn = document.getElementById("open-btn");
let button = document.getElementById("ok-btn");
// global variables
const numCard =
  '<div class="flex shadow-xl rounded cursor-pointer w-4 h-4 p-9 border-2 border-gray-600 text-4xl justify-center items-center" id="card"></div>';

let level = 2;
let selectedOperation = null;
let startValue;
let endValue;
let cardValues;

function generateCards(newLevel) {
  if (newLevel) cardContainer.innerHTML = "";
  for (var i = 0; i < level; i++)
    cardContainer.insertAdjacentHTML("afterbegin", numCard);
  generateNum();
}

function generateNum() {
  startValue = Math.floor(Math.random() * 20) + 1;
  cardValues = generateRandomArray();
  let temp = startValue;
  let inifity = 0;
  while (1) {
    if (inifity++ > 64) {
      cardValues = generateRandomArray();
      inifity = 0;
    }
    temp = startValue;
    const startingCardIndex = Math.floor(Math.random() * level);
    temp = generateOperation(temp, cardValues[startingCardIndex], null);
    if (temp === null) continue;
    // Choose remaining cards and perform operation
    const remainingCards = cardValues.filter(
      (value, index) => index !== startingCardIndex
    );
    for (var i = 0; i < remainingCards.length; i++) {
      temp = generateOperation(temp, remainingCards[i], null);
      if (temp === null) break;
    }
    if (temp !== null && temp > 0 && temp <= 30) {
      endValue = temp;
      break;
    } else {
      continue;
    }
  }

  WriteNumtoCards();
}

//write
function WriteNumtoCards() {
  startCard.textContent = startValue;
  endCard.textContent = endValue;
  const cards = document.querySelectorAll("#card");
  cards.forEach((element, key) => {
    element.textContent = cardValues[key];
    if (element.classList.contains("invisible"))
      element.classList.remove("invisible");
    element.addEventListener("click", handleClick);
  });
  alertReset();
}

// Generate random array
function generateRandomArray() {
  const cardValues = [];
  for (var i = 0; i < level; i++) {
    let value = Math.floor(Math.random() * 20) + 1;
    while (cardValues.includes(value)) {
      value = Math.floor(Math.random() * 20) + 1;
    }
    cardValues.push(value);
  }
  return cardValues;
}

//Generate operation
function generateOperation(first, second, operator) {
  if (operator === null) operator = Math.floor(Math.random() * 4);
  switch (operator) {
    case 0:
      return first + second;
    case 1:
      return first - second;
    case 2:
      return first * second;
    case 3:
      if (first % second === 0) {
        first /= second;
        return first;
      } else {
        return null;
      }
  }
}

// Set hander to get the current operation
operationButtons.forEach(function (button) {
  button.addEventListener("click", function (e) {
    selectedOperation = parseInt(e.target.value);
  });
});

// card click event handler
function handleClick() {
  if (selectedOperation === null) return;
  var result = generateOperation(
    parseInt(startCard.textContent),
    parseInt(this.textContent),
    selectedOperation
  );
  if (result === null) {
    errorAlert.classList.remove("hidden");
    selectedOperation = null;
    document.querySelectorAll("#card").forEach((element) => {
      if (!element.classList.contains("invisible"))
        element.classList.add("invisible");
    });
    return;
  }
  startCard.textContent = result;
  this.classList.add("invisible");
  if (document.querySelectorAll("#card[class*='invisible']").length === level) {
    if (result === endValue) {
      successAlert.classList.remove("hidden");
    } else {
      failAlert.classList.remove("hidden");
    }
    return;
  }
  selectedOperation = null;
}

//alert
function alertReset() {
  if (!successAlert.classList.contains("hidden"))
    successAlert.classList.add("hidden");
  if (!failAlert.classList.contains("hidden"))
    failAlert.classList.add("hidden");
  if (!errorAlert.classList.contains("hidden"))
    errorAlert.classList.add("hidden");
}

// Generate new level
function changeLevel() {
  level = parseInt(this.value);
  generateCards(true);
}

//modal
btn.addEventListener("click", function () {
  modal.style.display = "block";
});

button.addEventListener("click", function () {
  modal.style.display = "none";
});

//add new game function
newGame.addEventListener("click", generateNum);
//reset game function
resetGame.addEventListener("click", WriteNumtoCards);
// add function to level container
leveContainer.addEventListener("change", changeLevel);
// Call generateCards after the DOM has loaded
document.addEventListener("DOMContentLoaded", generateCards(false));
