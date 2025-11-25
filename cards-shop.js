const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  tg.ready();
}

const saveKey = "tapassets_save_v2";
let state = { coins: 0, cards: [] };

function loadState() {
  try {
    const raw = localStorage.getItem(saveKey);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state = saved;
  } catch (e) {
    console.error("Ошибка чтения сохранения:", e);
  }
}

function saveState() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(state));
  } catch (e) {
    console.error("Ошибка сохранения:", e);
  }
}

function renderCardsShop() {
  const cardsShopEl = document.getElementById("cardsShop");
  if (!cardsShopEl) return;
  
  cardsShopEl.innerHTML = "";
  
  // Стандартный набор карточек
  const defaultCards = [
    { id: "card1", name: "Редкая карта", desc: "Первая карта в коллекции", image: "🃏", cost: 50, owned: false, rarity: "common" },
    { id: "card2", name: "Эпическая карта", desc: "Очень ценная находка", image: "🦄", cost: 150, owned: false, rarity: "rare" },
    { id: "card3", name: "Легендарная карта", desc: "Невероятная редкость!", image: "🐉", cost: 500, owned: false, rarity: "epic" },
    { id: "card4", name: "Мифическая карта", desc: "Мечта коллекционера", image: "🌟", cost: 1200, owned: false, rarity: "legendary" },
    { id: "card5", name: "Золотая карта", desc: "Сияет как солнце", image: "⭐", cost: 2500, owned: false, rarity: "mythic" },
    { id: "card6", name: "Космическая карта", desc: "Пришелец из других миров", image: "👽", cost: 5000, owned: false, rarity: "cosmic" },
    { id: "card7", name: "Драконья карта", desc: "Дыхание огня", image: "🐲", cost: 8000, owned: false, rarity: "dragon" },
    { id: "card8", name: "Божественная карта", desc: "Власть над всем", image: "👑", cost: 15000, owned: false, rarity: "divine" }
  ];
  
  // Объединяем с сохраненными данными
  const cardsToShow = defaultCards.map(defaultCard => {
    const savedCard = state.cards?.find(c => c.id === defaultCard.id);
    return savedCard ? { ...defaultCard, ...savedCard } : defaultCard;
  });

  let availableCards = 0;
  
  cardsToShow.forEach(card => {
    if (card.owned) return; // Не показываем уже купленные карты
    
    availableCards++;
    const cardEl = document.createElement("div");
    cardEl.className = `card-item ${card.rarity}`;
    
    const cardImage = document.createElement("div");
    cardImage.className = "card-image";
    cardImage.textContent = card.image;
    
    const cardInfo = document.createElement("div");
    cardInfo.className = "card-info";
    
    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = card.name;
    
    const desc = document.createElement("div");
    desc.className = "card-desc";
    desc.textContent = card.desc;
    
    const cost = document.createElement("div");
    cost.className = "card-cost";
    cost.textContent = `Цена: ${card.cost} монет`;
    
    cardInfo.appendChild(name);
    cardInfo.appendChild(desc);
    cardInfo.appendChild(cost);
    
    const btn = document.createElement("button");
    btn.className = "card-buy-btn";
    btn.textContent = "Купить";
    if (state.coins < card.cost) btn.disabled = true;
    
    btn.addEventListener("click", () => {
      if (state.coins < card.cost) return;
      state.coins -= card.cost;
      card.owned = true;
      
      // Обновляем состояние
      if (!state.cards) state.cards = [];
      const existingCardIndex = state.cards.findIndex(c => c.id === card.id);
      if (existingCardIndex !== -1) {
        state.cards[existingCardIndex] = card;
      } else {
        state.cards.push(card);
      }
      
      saveState();
      renderCardsShop();
    });
    
    cardEl.appendChild(cardImage);
    cardEl.appendChild(cardInfo);
    cardEl.appendChild(btn);
    cardsShopEl.appendChild(cardEl);
  });
  
  if (availableCards === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "empty-message";
    emptyMsg.textContent = "🎉 Вы купили все доступные карточки!";
    cardsShopEl.appendChild(emptyMsg);
  }
}

// Инициализация
loadState();
renderCardsShop();