const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  tg.ready();
}

const saveKey = "tapassets_save_v2";

const defaultState = {
  coins: 0,
  perClick: 1,
  autoRate: 0,
  upgrades: [
    { id: "pc1", name: "+1 за клик", desc: "+1 монета за каждый клик.", baseCost: 10, level: 0, type: "perClick", amount: 1 },
    { id: "pc5", name: "+5 за клик", desc: "Серьёзный буст фарма.", baseCost: 120, level: 0, type: "perClick", amount: 5 },
    { id: "pc10", name: "+10 за клик", desc: "Для настоящих клик-мастеров.", baseCost: 600, level: 0, type: "perClick", amount: 10 },
    { id: "ac1", name: "Автоклик +1", desc: "+1 монета каждый секунду.", baseCost: 80, level: 0, type: "auto", amount: 1 },
    { id: "ac5", name: "Автоклик +5", desc: "Пассивный доход растёт.", baseCost: 400, level: 0, type: "auto", amount: 5 },
    { id: "ac10", name: "Автоклик +10", desc: "Ферма монет почти без кликов.", baseCost: 1500, level: 0, type: "auto", amount: 10 }
  ],
  cards: [
    { id: "card1", name: "Редкая карта", desc: "Первая карта в коллекции", image: "🃏", cost: 50, owned: false, rarity: "common" },
    { id: "card2", name: "Эпическая карта", desc: "Очень ценная находка", image: "🦄", cost: 150, owned: false, rarity: "rare" },
    { id: "card3", name: "Легендарная карта", desc: "Невероятная редкость!", image: "🐉", cost: 500, owned: false, rarity: "epic" },
    { id: "card4", name: "Мифическая карта", desc: "Мечта коллекционера", image: "🌟", cost: 1200, owned: false, rarity: "legendary" },
    { id: "card5", name: "Золотая карта", desc: "Сияет как солнце", image: "⭐", cost: 2500, owned: false, rarity: "mythic" },
    { id: "card6", name: "Космическая карта", desc: "Пришелец из других миров", image: "👽", cost: 5000, owned: false, rarity: "cosmic" },
    { id: "card7", name: "Драконья карта", desc: "Дыхание огня", image: "🐲", cost: 8000, owned: false, rarity: "dragon" },
    { id: "card8", name: "Божественная карта", desc: "Власть над всем", image: "👑", cost: 15000, owned: false, rarity: "divine" }
  ]
};

let state = structuredClone(defaultState);

// Элементы интерфейса
const coinsEl = document.getElementById("coins");
const perClickEl = document.getElementById("perClick");
const autoRateEl = document.getElementById("autoRate");
const clickBtn = document.getElementById("clickBtn");
const shopEl = document.getElementById("shop");
const cardsShopBtn = document.getElementById("cardsShopBtn");
const myCardsBtn = document.getElementById("myCardsBtn");

// Навигация
cardsShopBtn.addEventListener("click", () => {
  window.location.href = 'cards-shop.html';
});

myCardsBtn.addEventListener("click", () => {
  window.location.href = 'my-cards.html';
});

function loadState() {
  try {
    const raw = localStorage.getItem(saveKey);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state = Object.assign({}, defaultState, saved);
    
    // Восстанавливаем улучшения
    if (!Array.isArray(state.upgrades)) {
      state.upgrades = structuredClone(defaultState.upgrades);
    } else {
      const map = new Map(defaultState.upgrades.map(u => [u.id, u]));
      state.upgrades = state.upgrades.map(u => Object.assign({}, map.get(u.id) || {}, u));
    }
    
    // Восстанавливаем карточки
    if (!Array.isArray(state.cards)) {
      state.cards = structuredClone(defaultState.cards);
    } else {
      const map = new Map(defaultState.cards.map(c => [c.id, c]));
      state.cards = state.cards.map(c => Object.assign({}, map.get(c.id) || {}, c));
    }
  } catch (e) {
    console.error("Ошибка чтения сохранения:", e);
    state = structuredClone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(state));
  } catch (e) {
    console.error("Ошибка сохранения:", e);
  }
}

function getUpgradeCost(upg) {
  return Math.floor(upg.baseCost * Math.pow(1.5, upg.level));
}

function renderStats() {
  coinsEl.textContent = Math.floor(state.coins);
  perClickEl.textContent = state.perClick;
  autoRateEl.textContent = state.autoRate;
}

function renderShop() {
  shopEl.innerHTML = "";
  state.upgrades.forEach(upg => {
    const cost = getUpgradeCost(upg);
    const item = document.createElement("div");
    item.className = "shop-item";

    const info = document.createElement("div");
    info.className = "shop-item-info";

    const name = document.createElement("div");
    name.className = "shop-item-name";
    name.textContent = upg.name + (upg.level > 0 ? ` (ур. ${upg.level})` : "");

    const desc = document.createElement("div");
    desc.className = "shop-item-desc";
    desc.textContent = upg.desc;

    const meta = document.createElement("div");
    meta.className = "shop-item-meta";
    meta.textContent = `Цена: ${cost} • +${upg.amount} ${upg.type === "perClick" ? "за клик" : "авто/сек"}`;

    info.appendChild(name);
    info.appendChild(desc);
    info.appendChild(meta);

    const btn = document.createElement("button");
    btn.textContent = "Купить";
    if (state.coins < cost) btn.disabled = true;
    btn.addEventListener("click", () => {
      if (state.coins < cost) return;
      state.coins -= cost;
      upg.level += 1;
      if (upg.type === "perClick") state.perClick += upg.amount;
      else if (upg.type === "auto") state.autoRate += upg.amount;
      updateAll();
    });

    item.appendChild(info);
    item.appendChild(btn);
    shopEl.appendChild(item);
  });
}

function updateAll(save = true) {
  renderStats();
  renderShop();
  if (save) saveState();
  updateMainButton();
}

function updateMainButton() {
  if (!tg) return;
  tg.MainButton.setText(`Отправить: ${Math.floor(state.coins)} монет`);
  tg.MainButton.show();
}

function initMainButton() {
  if (!tg) return;
  tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({
      coins: Math.floor(state.coins),
      perClick: state.perClick,
      autoRate: state.autoRate,
      upgrades: state.upgrades.map(u => ({ id: u.id, level: u.level })),
      cards: state.cards.filter(c => c.owned).map(c => ({ id: c.id }))
    }));
  });
}

clickBtn.addEventListener("click", () => {
  state.coins += state.perClick;
  updateAll();
});

setInterval(() => {
  if (state.autoRate > 0) {
    state.coins += state.autoRate;
    updateAll();
  }
}, 1000);

// Инициализация
loadState();
initMainButton();
updateAll(false);
