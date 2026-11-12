const form = document.querySelector("#value-form");

const fields = {
  coins: document.querySelector("#coins"),
  coinUnit: document.querySelector("#coin-unit"),
  baseRatio: document.querySelector("#base-ratio"),
  ammoPrice: document.querySelector("#ammo-price"),
  eggsPrice: document.querySelector("#eggs-price"),
  setsPrice: document.querySelector("#sets-price"),
  bagsPrice: document.querySelector("#bags-price"),
  ammo: document.querySelector("#ammo"),
  eggs: document.querySelector("#eggs"),
  sets: document.querySelector("#sets"),
  bags: document.querySelector("#bags"),
  knifeSkin: document.querySelector("#knife-skin"),
  characterSkin: document.querySelector("#character-skin"),
};

const output = {
  total: document.querySelector("#total-price"),
  coinBase: document.querySelector("#coin-base"),
  bonus: document.querySelector("#bonus-value"),
  ammo: document.querySelector("#ammo-value"),
  eggs: document.querySelector("#eggs-value"),
  sets: document.querySelector("#sets-value"),
  bags: document.querySelector("#bags-value"),
  currentRatio: document.querySelector("#current-ratio"),
  coinUnitHint: document.querySelector("#coin-unit-hint"),
};

const currency = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function safeNumber(input, maximum = Infinity) {
  const value = Number.parseFloat(input.value);

  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.min(value, maximum);
}

function formatCurrency(value) {
  return `¥${currency.format(value)}`;
}

function calculate() {
  const isYi = fields.coinUnit.value === "yi";
  const coinWan = safeNumber(fields.coins) * (isYi ? 10000 : 100);
  const baseRatio = Math.max(safeNumber(fields.baseRatio), 3);
  const coinBase = coinWan / baseRatio;
  const ratioReduction = Number(fields.knifeSkin.checked) + Number(fields.characterSkin.checked);
  const currentRatio = baseRatio - ratioReduction;
  const adjustedCoinValue = coinWan / currentRatio;
  const bonusValue = adjustedCoinValue - coinBase;
  const ammoValue = safeNumber(fields.ammo) * safeNumber(fields.ammoPrice);
  const eggsValue = (safeNumber(fields.eggs) / 60) * safeNumber(fields.eggsPrice);
  const setsValue = safeNumber(fields.sets) * safeNumber(fields.setsPrice);
  const bagsValue = safeNumber(fields.bags) * safeNumber(fields.bagsPrice);
  const total = adjustedCoinValue + ammoValue + eggsValue + setsValue + bagsValue;

  output.total.textContent = currency.format(total);
  output.coinBase.textContent = formatCurrency(coinBase);
  output.bonus.textContent = `+ ${formatCurrency(bonusValue)}`;
  output.ammo.textContent = formatCurrency(ammoValue);
  output.eggs.textContent = formatCurrency(eggsValue);
  output.sets.textContent = formatCurrency(setsValue);
  output.bags.textContent = formatCurrency(bagsValue);
  output.currentRatio.textContent = `当前比例：${currentRatio.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} 万哈夫币 = ¥1`;
  output.coinUnitHint.textContent = isYi
    ? "当前单位为亿，例如 1.2 亿就填写 1.2"
    : "当前单位为 m（百万），例如 25m 就填写 25";
}

form.addEventListener("input", calculate);
form.addEventListener("reset", () => window.requestAnimationFrame(calculate));

calculate();
