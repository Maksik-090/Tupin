import json
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, LabeledPrice

bot = telebot.TeleBot("8244088330:AAEeb-l7Hh6FIPjiZdvUHlN83_INpMerXK4")
PAYMENT_TOKEN = "2051251535:TEST:OTk5MDA4ODgxLTAwNQ"   # RedsysTest token


# =========================
#   КНОПКА /start (WebApp)
# =========================
@bot.message_handler(commands=['start'])
def start(msg):
    markup = InlineKeyboardMarkup()
    btn = InlineKeyboardButton(
        text="🎮 Открыть TapAssets",
        web_app=WebAppInfo(url="https://maksik-090.github.io/Tupin/")
    )
    markup.add(btn)

    bot.send_message(
        msg.chat.id,
        "Добро пожаловать в TapAssets! 👋\nНажмите кнопку ниже, чтобы открыть игру:",
        reply_markup=markup
    )


# =========================
#          /shop
# =========================
@bot.message_handler(commands=['shop'])
def shop(msg):
    markup = InlineKeyboardMarkup()
    markup.add(
        InlineKeyboardButton("✨ +1 клик — 49€", callback_data="buy_1"),
        InlineKeyboardButton("⚡ +5 кликов — 99€", callback_data="buy_5")
    )
    markup.add(
        InlineKeyboardButton("🔥 +10 кликов — 199€", callback_data="buy_10"),
        InlineKeyboardButton("💎 +25 кликов — 399€", callback_data="buy_25")
    )

    bot.send_message(
        msg.chat.id,
        "🛒 *Магазин TapAssets*\nВыберите донат-пакет, чтобы усилить клики:",
        parse_mode="Markdown",
        reply_markup=markup
    )


# =========================
#     КНОПКИ ПОКУПКИ
# =========================
PACKS = {
    "buy_1":  ("+1 клик", 49, 1),
    "buy_5":  ("+5 кликов", 99, 5),
    "buy_10": ("+10 кликов", 199, 10),
    "buy_25": ("+25 кликов", 399, 25),
}

@bot.callback_query_handler(func=lambda c: c.data in PACKS)
def process_buy(call):
    title, price_rub, per_click_add = PACKS[call.data]

    prices = [LabeledPrice(label=title, amount=price_rub * 100)]  # копейки

    bot.send_invoice(
        call.message.chat.id,
        title=title,
        description=f"Покупка улучшения: {title}",
        provider_token=PAYMENT_TOKEN,
        currency="EUR",
        prices=prices,
        start_parameter=call.data,
        invoice_payload=f"{call.data}:{per_click_add}"
    )

# =========================
#   ПОДТВЕРЖДЕНИЕ ОПЛАТЫ
# =========================
@bot.pre_checkout_query_handler(func=lambda q: True)
def checkout(q):
    bot.answer_pre_checkout_query(q.id, ok=True)


@bot.message_handler(content_types=['successful_payment'])
def pay_done(msg):
    payload = msg.successful_payment.invoice_payload
    pack_id, add_value = payload.split(":")
    add_value = int(add_value)

    # ———— здесь выдаём награду ————
    # Можно хранить прогресс в БД, но пока просто отправим сообщение:
    bot.send_message(
    msg.chat.id,
    f"🎉 Оплата успешна! +{add_value} к силе клика",
    parse_mode="Markdown"
    )

    # отправка в WebApp
       # увы #
    
    
bot.polling()
