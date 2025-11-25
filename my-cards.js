const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  tg.ready();
}

const saveKey = "tapassets_save_v2";
let state = { cards: [] };

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

function renderMyCards() {
  const myCardsEl = document.getElementById("myCards");
  if (!myCardsEl) return;
  
  myCardsEl.innerHTML = "";
  
  const ownedCards = state.cards?.filter(card => card.owned) || [];
  
  if (ownedCards.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "empty-message";
    emptyMsg.textContent = "📭 У вас пока нет карточек. Посетите магазин!";
    myCardsEl.appendChild(emptyMsg);
    return;
  }
  
  ownedCards.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = `card-item owned ${card.rarity}`;
    
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
    
    const ownedBadge = document.createElement("div");
    ownedBadge.className = "owned-badge";
    ownedBadge.textContent = "✓ В коллекции";
    
    cardInfo.appendChild(name);
    cardInfo.appendChild(desc);
    cardInfo.appendChild(ownedBadge);
    
    cardEl.appendChild(cardImage);
    cardEl.appendChild(cardInfo);
    myCardsEl.appendChild(cardEl);
  });
}

// Инициализация
loadState();
renderMyCards();