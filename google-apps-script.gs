// ===== НАЛАШТУВАННЯ =====
const SHEET_URL = "https://script.google.com/macros/library/d/1zW761vXdoqMqkmqlDEoPLJg7x_20UEtDZHueUtmaKdxkP1ESEUlX-iYK/14";
const PRICE="1880"
const FB_PIXEL_ID = "2238790460315244";
const SPREADSHEET_ID = "https://script.google.com/macros/s/AKfycbz4An-BYB2Lrrcxfm9fjFFMMaga1zybu9QLDAyqz3cVu68u8u6QUPlwWZGQ2ztenKM/exec";   // якщо скрипт створено НЕ з самої таблиці — вставте ID таблиці
const SHEET_NAME = "Замовлення";
const BOT_TOKEN = "9101722384:AAEyzea7p4lYn4s-TfGlQuCHaV8KZhVnvOI";        // токен від @BotFather, напр. 123456:ABC-DEF...
const CHAT_ID = "8742326704";          // ваш chat id або id групи (для груп починається з -)
// ========================

function getSS_() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

// Перевірка: відкрийте URL веб-додатка у браузері — має з'явитись текст нижче
function doGet() {
  return ContentService.createTextOutput("Скрипт працює");
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  try {
    const ss = getSS_();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Дата", "Ім'я", "Телефон", "Місто", "Відділення НП", "Товар", "Ціна, грн", "Джерело", "Сторінка"]);
    }
    sh.appendRow([
      new Date(), p.name || "", "'" + (p.phone || ""), p.city || "", p.branch || "",
      p.product || "", p.price || "", p.source || "", p.page || ""
    ]);
  } catch (err) {
    console.error("Sheet error: " + err);
  }
  // Telegram окремо: якщо він не спрацює, рядок у таблиці вже збережено
  try {
    sendTelegram_(p);
  } catch (err) {
    console.error("Telegram error: " + err);
  }
  return ContentService.createTextOutput("ok");
}

function esc_(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sendTelegram_(p) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  const text =
    "🆕 <b>Нове замовлення</b>\n\n" +
    "📦 " + esc_(p.product) + (p.price ? " — " + esc_(p.price) + " грн" : "") + "\n" +
    "👤 " + esc_(p.name) + "\n" +
    "📞 " + esc_(p.phone) + "\n" +
    "🏙 " + esc_(p.city) + "\n" +
    "📮 НП: " + esc_(p.branch) +
    (p.source ? "\n🔗 Джерело: " + esc_(p.source) : "");
  const r = UrlFetchApp.fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
    method: "post",
    payload: { chat_id: CHAT_ID, text: text, parse_mode: "HTML" },
    muteHttpExceptions: true
  });
  if (r.getResponseCode() !== 200) console.error("Telegram: " + r.getContentText());
}

// Допоміжна: запустіть вручну, щоб перевірити Telegram і дати дозвіл на зовнішні запити
function testTelegram() {
  sendTelegram_({ product: "Тест", price: "0", name: "Тест", phone: "+380000000000", city: "Київ", branch: "№1" });
}
