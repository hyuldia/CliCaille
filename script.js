let score = 0;
let clickRate = 1;
let upgradeLevel1 = 0;
let upgradeCost1 = 10;
let upgradeLevel2 = 0;
let upgradeCost2 = 50;

const COST_MULTIPLIER = 1.25;
const BASE_COST_1 = 10;
const BASE_COST_2 = 50;
const CLICK_INCREMENT_MULTIPLIER = 1.2;
const CLICK_INCREMENT_FIXED = 1;
const CLICK_THRESHOLD = 10;
const CPS_FIXED_GAIN = 1;
const CPS_THRESHOLD = 10;
const CPS_MULTIPLIER = 1.1;

const scoreDisplay = document.getElementById("score");
const cailleImage = document.getElementById("caille-image");
const clickRateDisplay = document.getElementById("click-rate");
const cpsRateDisplay = document.getElementById("cps-rate");
const upgradeCost1Display = document.getElementById("upgrade-cost-1");
const buyUpgrade1Button = document.getElementById("buy-upgrade-1");
const upgradeCost2Display = document.getElementById("upgrade-cost-2");
const buyUpgrade2Button = document.getElementById("buy-upgrade-2");
const resetButton = document.getElementById("reset-button");

function loadGame() {
  const savedData = localStorage.getItem("cailleClickerSave");
  if (savedData) {
    const data = JSON.parse(savedData);

    score = Math.round(parseFloat(data.score)) || 0;
    upgradeLevel1 = data.upgradeLevel1 || 0;
    upgradeLevel2 = data.upgradeLevel2 || 0;

    upgradeCost1 = Math.round(
      BASE_COST_1 * Math.pow(COST_MULTIPLIER, upgradeLevel1)
    );
    upgradeCost2 = Math.round(
      BASE_COST_2 * Math.pow(COST_MULTIPLIER, upgradeLevel2)
    );
    clickRate = calculateClickRate(upgradeLevel2);

    console.log(
      "Jeu chargé. Score:",
      score,
      "Niveau d'amélioration 1:",
      upgradeLevel1,
      "Niveau d'amélioration 2:",
      upgradeLevel2
    );
  }
  updateDisplay();
}

function saveGame() {
  const dataToSave = {
    score: score,
    upgradeLevel1: upgradeLevel1,
    upgradeLevel2: upgradeLevel2,
  };
  localStorage.setItem("cailleClickerSave", JSON.stringify(dataToSave));
}

function calculateClickRate(level) {
  let rate = 1; 

  if (level <= CLICK_THRESHOLD) {
    rate += level * CLICK_INCREMENT_FIXED;
  } else {
    let initialGain = CLICK_THRESHOLD * CLICK_INCREMENT_FIXED;
    const multiplierLevels = level - CLICK_THRESHOLD;
    rate +=
      initialGain * Math.pow(CLICK_INCREMENT_MULTIPLIER, multiplierLevels);
  }
  return Math.round(rate);
}

function updateDisplay() {
  clickRate = calculateClickRate(upgradeLevel2);
  scoreDisplay.textContent = Math.round(score).toLocaleString("fr-FR");
  clickRateDisplay.textContent = clickRate.toLocaleString("fr-FR");
  upgradeCost1Display.textContent = upgradeCost1.toLocaleString("fr-FR");
  let totalCPS = 0;

  if (upgradeLevel1 <= CPS_THRESHOLD) {
    totalCPS = upgradeLevel1 * CPS_FIXED_GAIN;
  } else {
    totalCPS = CPS_THRESHOLD * CPS_FIXED_GAIN;
    const multiplierLevels = upgradeLevel1 - CPS_THRESHOLD;
    totalCPS *= Math.pow(CPS_MULTIPLIER, multiplierLevels);
  }
  cpsRateDisplay.textContent = Math.round(totalCPS).toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (score >= upgradeCost1) {
    buyUpgrade1Button.disabled = false;
    buyUpgrade1Button.textContent = `Acheter (${upgradeCost1.toLocaleString(
      "fr-FR"
    )})`;
  } else {
    buyUpgrade1Button.disabled = true;
    buyUpgrade1Button.textContent = `Pas assez de Caille!`;
  }

  upgradeCost2Display.textContent = upgradeCost2.toLocaleString("fr-FR");

  if (score >= upgradeCost2) {
    buyUpgrade2Button.disabled = false;
    buyUpgrade2Button.textContent = `Acheter (${upgradeCost2.toLocaleString(
      "fr-FR"
    )})`;
  } else {
    buyUpgrade2Button.disabled = true;
    buyUpgrade2Button.textContent = `Pas assez de Caille !`;
  }
}

function clickCaille(e) {
  score += clickRate;
  updateDisplay();

  const floatingImage = document.createElement("img");

  floatingImage.src = "assets/caille_asset.png";
  floatingImage.classList.add("floating-caille-image");

  floatingImage.style.left = `${e.clientX - 15}px`;
  floatingImage.style.top = `${e.clientY - 15}px`;

  document.body.appendChild(floatingImage);

  setTimeout(() => {
    floatingImage.remove();
  }, 1200);
}

function buyUpgrade1() {
  if (score >= upgradeCost1) {
    score -= upgradeCost1;
    upgradeLevel1++;

    upgradeCost1 = Math.round(
      BASE_COST_1 * Math.pow(COST_MULTIPLIER, upgradeLevel1)
    );

    updateDisplay();
  }
}

function buyUpgrade2() {
  if (score >= upgradeCost2) {
    score -= upgradeCost2;
    upgradeLevel2++;

    upgradeCost2 = Math.round(
      BASE_COST_2 * Math.pow(COST_MULTIPLIER, upgradeLevel2)
    );
    updateDisplay();
  }
}
function resetGame() {
  if (!confirm("Êtes-vous sûr de vouloir réinitialiser votre progression ?")) {
    return;
  }

  score = 0;
  upgradeLevel1 = 0;
  upgradeLevel2 = 0;

  upgradeCost1 = BASE_COST_1;
  upgradeCost2 = BASE_COST_2;

  clickRate = 1;

  localStorage.removeItem("cailleClickerSave");

  updateDisplay();

  alert("Progression de CliCaille réinitialisée avec succès !");
}

function autoClicker() {
  let generatedCaille = 0;

  if (upgradeLevel1 <= CPS_THRESHOLD) {
    generatedCaille = upgradeLevel1 * CPS_FIXED_GAIN;
  } else {
    generatedCaille = CPS_THRESHOLD * CPS_FIXED_GAIN;
    const multiplierLevels = upgradeLevel1 - CPS_THRESHOLD;
    generatedCaille *= Math.pow(CPS_MULTIPLIER, multiplierLevels);
  }

  score += Math.floor(generatedCaille);

  saveGame();
  updateDisplay();
}

setInterval(autoClicker, 3000);

loadGame();

cailleImage.addEventListener("click", clickCaille);
buyUpgrade1Button.addEventListener("click", buyUpgrade1);
buyUpgrade2Button.addEventListener("click", buyUpgrade2);
resetButton.addEventListener("click", resetGame);
setInterval(saveGame, 15000);

