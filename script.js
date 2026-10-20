// ============================
// CORE STATE + DOM
// ============================

let selectedPair = null;
let selectedTimingSeconds = null;
let autoMode = false;
let history = [];

// DOM

const clockEl = document.getElementById("clock");

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

const glassPanel = document.getElementById("glassPanel");
const glassHeader = document.getElementById("glassHeader");

const pairSearchInput = document.getElementById("pairSearchInput");
const pairMasterSelect = document.getElementById("pairMasterSelect");
const selectedPairText = document.getElementById("selectedPairText");

const brokerSelect = document.getElementById("brokerSelect");
const autoToggleBtn = document.getElementById("autoToggleBtn");
const createSignalBtn = document.getElementById("createSignalBtn");

const signalPanel = document.getElementById("signalPanel");
const signalDirectionEl = document.getElementById("signalDirection");
const signalScoreEl = document.getElementById("signalScore");
const trendArrowEl = document.getElementById("trendArrow");
const riskLevelEl = document.getElementById("riskLevel");
const sessionInfoEl = document.getElementById("sessionInfo");
const sourceInfoEl = document.getElementById("sourceInfo");
const modeInfoEl = document.getElementById("modeInfo");
const timingInfoEl = document.getElementById("timingInfo");

const historyList = document.getElementById("historyList");
const popupAlert = document.getElementById("popupAlert");

const timingButtons = document.querySelectorAll(".timing-btn");

// ============================
// DROPDOWN POPULATE
// ============================

function populatePairDropdown(list) {
  pairMasterSelect.innerHTML = `<option value="">Select pair...</option>`;
  list.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.symbol;
    opt.textContent = p.label;
    pairMasterSelect.appendChild(opt);
  });
}

// TIMING SELECT
timingButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTimingSeconds = Number(btn.dataset.sec);
    timingInfoEl.textContent = `Timing: ${selectedTimingSeconds}s`;
  });
});
// ============================
// FULL PAIR LIST (FINAL MERGED)
// ============================

const FULL_PAIRS = [

  // ===== FOREX MAJOR =====
  { symbol: "EUR/USD", label: "EUR/USD (Major)" },
  { symbol: "GBP/USD", label: "GBP/USD (Major)" },
  { symbol: "USD/JPY", label: "USD/JPY (Major)" },
  { symbol: "USD/CHF", label: "USD/CHF (Major)" },
  { symbol: "AUD/USD", label: "AUD/USD (Major)" },
  { symbol: "NZD/USD", label: "NZD/USD (Major)" },
  { symbol: "USD/CAD", label: "USD/CAD (Major)" },

  // ===== FOREX MINOR =====
  { symbol: "EUR/GBP", label: "EUR/GBP (Minor)" },
  { symbol: "EUR/JPY", label: "EUR/JPY (Minor)" },
  { symbol: "GBP/JPY", label: "GBP/JPY (Minor)" },
  { symbol: "AUD/JPY", label: "AUD/JPY (Minor)" },
  { symbol: "CAD/JPY", label: "CAD/JPY (Minor)" },
  { symbol: "CHF/JPY", label: "CHF/JPY (Minor)" },
  { symbol: "AUD/NZD", label: "AUD/NZD (Minor)" },
  { symbol: "AUD/CAD", label: "AUD/CAD (Minor)" },
  { symbol: "NZD/CAD", label: "NZD/CAD (Minor)" },

  // ===== FOREX EXOTIC =====
  { symbol: "USD/INR", label: "USD/INR (Exotic)" },
  { symbol: "EUR/INR", label: "EUR/INR (Exotic)" },
  { symbol: "GBP/INR", label: "GBP/INR (Exotic)" },
  { symbol: "USD/TRY", label: "USD/TRY (Exotic)" },
  { symbol: "EUR/TRY", label: "EUR/TRY (Exotic)" },
  { symbol: "USD/ZAR", label: "USD/ZAR (Exotic)" },
  { symbol: "USD/MXN", label: "USD/MXN (Exotic)" },
  { symbol: "USD/SGD", label: "USD/SGD (Exotic)" },
  { symbol: "USD/HKD", label: "USD/HKD (Exotic)" },
  { symbol: "USD/CNH", label: "USD/CNH (Exotic)" },

  // ===== METALS =====
  { symbol: "XAU/USD", label: "XAU/USD (Gold)" },
  { symbol: "XAG/USD", label: "XAG/USD (Silver)" },
  { symbol: "XPT/USD", label: "XPT/USD (Platinum)" },
  { symbol: "XPD/USD", label: "XPD/USD (Palladium)" },

  // ===== INDICES =====
  { symbol: "US30", label: "US30 (Dow Jones)" },
  { symbol: "US500", label: "US500 (S&P 500)" },
  { symbol: "NAS100", label: "NAS100 (Nasdaq)" },
  { symbol: "JP225", label: "JP225 (Nikkei)" },
  { symbol: "DE40", label: "DE40 (DAX)" },
  { symbol: "FR40", label: "FR40 (CAC)" },
  { symbol: "UK100", label: "UK100 (FTSE)" },

  // ===== COMMODITIES OTC =====
  { symbol: "USCRUDE_OTC", label: "USCRUDE (OTC)" },
  { symbol: "UKBRENT_OTC", label: "UKBRENT (OTC)" },
  { symbol: "SILVER_OTC", label: "SILVER (OTC)" },
  { symbol: "GOLD_OTC", label: "GOLD (OTC)" },

  // ===== CRYPTO MAJOR =====
  { symbol: "BTC/USD", label: "BTC/USD (Bitcoin)" },
  { symbol: "ETH/USD", label: "ETH/USD (Ethereum)" },
  { symbol: "BNB/USD", label: "BNB/USD (Binance Coin)" },
  { symbol: "SOL/USD", label: "SOL/USD (Solana)" },
  { symbol: "XRP/USD", label: "XRP/USD (Ripple)" },
  { symbol: "ADA/USD", label: "ADA/USD (Cardano)" },
  { symbol: "DOGE/USD", label: "DOGE/USD (Dogecoin)" },
  { symbol: "LTC/USD", label: "LTC/USD (Litecoin)" },

  // ===== CRYPTO OTC (FINAL MERGED) =====
  { symbol: "COSMOS_OTC", label: "COSMOS (OTC)" },
  { symbol: "DASH_OTC", label: "DASH (OTC)" },
  { symbol: "SOLINA_OTC", label: "SOLINA (OTC)" },
  { symbol: "BINANCECOIN_OTC", label: "BINANCE COIN (OTC)" },
  { symbol: "TRUMP_OTC", label: "TRUMP (OTC)" },
  { symbol: "BITCOIN_OTC", label: "BITCOIN (OTC)" },
  { symbol: "ETHEREUM_OTC", label: "ETHEREUM (OTC)" },

  // ===== CRYPTO /USDT =====
  { symbol: "BTC/USDT", label: "BTC/USDT" },
  { symbol: "ETH/USDT", label: "ETH/USDT" },
  { symbol: "BNB/USDT", label: "BNB/USDT" },
  { symbol: "SOL/USDT", label: "SOL/USDT" },
  { symbol: "XRP/USDT", label: "XRP/USDT" },
  { symbol: "ADA/USDT", label: "ADA/USDT" },
  { symbol: "DOGE/USDT", label: "DOGE/USDT" },
  { symbol: "LTC/USDT", label: "LTC/USDT" },

  // ===== STOCKS =====
  { symbol: "AAPL", label: "AAPL (Apple)" },
  { symbol: "MSFT", label: "MSFT (Microsoft)" },
  { symbol: "GOOGL", label: "GOOGL (Alphabet)" },
  { symbol: "AMZN", label: "AMZN (Amazon)" },
  { symbol: "META", label: "META (Meta)" },
  { symbol: "TSLA", label: "TSLA (Tesla)" },
  { symbol: "NVDA", label: "NVDA (NVIDIA)" },

  // ===== QUOTEX OTC (FINAL MERGED) =====
  { symbol: "EUR/USD_OTC", label: "EUR/USD (OTC)" },
  { symbol: "GBP/USD_OTC", label: "GBP/USD (OTC)" },
  { symbol: "USD/JPY_OTC", label: "USD/JPY (OTC)" },
  { symbol: "AUD/USD_OTC", label: "AUD/USD (OTC)" },
  { symbol: "NZD/USD_OTC", label: "NZD/USD (OTC)" },
  { symbol: "USD/CAD_OTC", label: "USD/CAD (OTC)" },
  { symbol: "XAU/USD_OTC", label: "XAU/USD (Gold OTC)" },
  { symbol: "BTC/USD_OTC", label: "BTC/USD (OTC)" },

  // NEW QUOTEX OTC YOU PROVIDED
  { symbol: "NZD/JPY_OTC", label: "NZD/JPY (OTC)" },
  { symbol: "USD/DZD_OTC", label: "USD/DZD (OTC)" },
  { symbol: "USD/BDT_OTC", label: "USD/BDT (OTC)" },
  { symbol: "NZD/CHF_OTC", label: "NZD/CHF (OTC)" },
  { symbol: "USD/COP_OTC", label: "USD/COP (OTC)" },
  { symbol: "USD/PHP_OTC", label: "USD/PHP (OTC)" },
  { symbol: "USD/INR_OTC", label: "USD/INR (OTC)" },
  { symbol: "USD/BRL_OTC", label: "USD/BRL (OTC)" },
  { symbol: "NZD/CAD_OTC", label: "NZD/CAD (OTC)" },
  { symbol: "USD/ZAR_OTC", label: "USD/ZAR (OTC)" },
  { symbol: "USD/ARS_OTC", label: "USD/ARS (OTC)" },
  { symbol: "USD/EGP_OTC", label: "USD/EGP (OTC)" },
  { symbol: "AUD/NZD_OTC", label: "AUD/NZD (OTC)" },
  { symbol: "USD/NGN_OTC", label: "USD/NGN (OTC)" },
  { symbol: "USD/IDR_OTC", label: "USD/IDR (OTC)" },
  { symbol: "USD/MXN_OTC", label: "USD/MXN (OTC)" },
  { symbol: "USD/PKR_OTC", label: "USD/PKR (OTC)" },
  { symbol: "GBP/NZD_OTC", label: "GBP/NZD (OTC)" },
  { symbol: "EUR/NZD_OTC", label: "EUR/NZD (OTC)" },

];

// ============================
// DROPDOWN + SEARCH + PREVIEW
// ============================

populatePairDropdown(FULL_PAIRS);

pairSearchInput.addEventListener("input", () => {
  const query = pairSearchInput.value.trim().toLowerCase();
  if (!query) {
    populatePairDropdown(FULL_PAIRS);
    return;
  }

  const filtered = FULL_PAIRS.filter(
    (p) =>
      p.label.toLowerCase().includes(query) ||
      p.symbol.toLowerCase().includes(query)
  );
  populatePairDropdown(filtered);
});

pairMasterSelect.addEventListener("change", () => {
  const symbol = pairMasterSelect.value;
  if (!symbol) {
    selectedPair = null;
    selectedPairText.textContent = "No pair selected";
    return;
  }

  const found = FULL_PAIRS.find((p) => p.symbol === symbol);
  selectedPair = found || { symbol, label: symbol };
  selectedPairText.textContent = selectedPair.label;
});
// ============================
// INIT DROPDOWN + SEARCH
// ============================

populatePairDropdown(FULL_PAIRS);

pairSearchInput.addEventListener("input", () => {
  const q = pairSearchInput.value.trim().toLowerCase();
  if (!q) {
    populatePairDropdown(FULL_PAIRS);
    return;
  }
  const filtered = FULL_PAIRS.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.symbol.toLowerCase().includes(q)
  );
  populatePairDropdown(filtered);
});

pairMasterSelect.addEventListener("change", () => {
  const symbol = pairMasterSelect.value;
  if (!symbol) {
    selectedPair = null;
    selectedPairText.textContent = "No pair selected";
    return;
  }
  const found = FULL_PAIRS.find((p) => p.symbol === symbol);
  selectedPair = found || { symbol, label: symbol };
  selectedPairText.textContent = selectedPair.label;
});
// ============================
// SIGNAL ENGINE
// ============================

createSignalBtn.addEventListener("click", () => {
  if (!selectedPair) {
    showPopup("Select a pair first");
    return;
  }
  if (!selectedTimingSeconds) {
    showPopup("Select timing first");
    return;
  }

  const score = Math.floor(Math.random() * 100) - 50;
  const absScore = Math.abs(score;

  let direction = "NEUTRAL";
  let trendText = "→ Sideways";
  let riskText = "Low Risk";

  signalPanel.classList.remove("glow-buy", "glow-sell", "glow-neutral");

  if (score > 15) {
    direction = "BUY";
    trendText = "↑ Bullish";
    riskText = absScore > 35 ? "High Risk" : "Medium Risk";
    signalPanel.classList.add("glow-buy");
  } else if (score < -15) {
    direction = "SELL";
    trendText = "↓ Bearish";
    riskText = absScore > 35 ? "High Risk" : "Medium Risk";
    signalPanel.classList.add("glow-sell");
  } else {
    direction = "NEUTRAL";
    trendText = "→ Sideways";
    riskText = "Low Risk";
    signalPanel.classList.add("glow-neutral");
  }

  signalDirectionEl.textContent = direction;
  signalScoreEl.textContent = `Score: ${score}`;
  trendArrowEl.textContent = trendText;
  riskLevelEl.textContent = riskText;

  const broker = brokerSelect.value;
  sessionInfoEl.textContent = `Session: ${broker}`;
  sourceInfoEl.textContent = autoMode ? "Source: Auto" : "Source: Manual";

  addToHistory({
    time: new Date().toLocaleTimeString(),
    pair: selectedPair.label,
    direction,
    score,
    timing: selectedTimingSeconds,
    broker,
  });

  showPopup(`Signal: ${direction} on ${selectedPair.symbol}`);
});

// ============================
// HISTORY
// ============================

function addToHistory(entry) {
  history.unshift(entry);
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((h) => {
    const li = document.createElement("li");
    li.textContent = `[${h.time}] ${h.pair} → ${h.direction} (Score: ${h.score}, ${h.timing}s, ${h.broker})`;
    historyList.appendChild(li);
  });
}

// ============================
// POPUP
// ============================

let popupTimeout = null;

function showPopup(msg) {
  popupAlert.textContent = msg;
  popupAlert.style.display = "block";
  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => {
    popupAlert.style.display = "none";
  }, 2000);
}

// ============================
// AUTO MODE
// ============================

autoToggleBtn.addEventListener("click", () => {
  autoMode = !autoMode;
  autoToggleBtn.textContent = autoMode ? "Auto: ON" : "Auto: OFF";
  modeInfoEl.textContent = autoMode ? "Mode: Auto" : "Mode: Manual";

  if (autoMode) {
    autoToggleBtn.classList.add("glow-buy");
    showPopup("Auto mode enabled");
  } else {
    autoToggleBtn.classList.remove("glow-buy");
    showPopup("Auto mode disabled");
  }
});
// ============================
// DRAG SYSTEM
// ============================

(function enablePanelDrag() {
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  glassHeader.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = glassPanel.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    glassPanel.style.left = `${startLeft + dx}px`;
    glassPanel.style.top = `${startTop + dy}px`;
    glassPanel.style.right = "auto";
    glassPanel.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = "auto";
  });
})();

// ============================
// INITIAL DEFAULTS
// ============================

signalPanel.classList.add("glow-neutral");
signalDirectionEl.textContent = "NEUTRAL";
modeInfoEl.textContent = "Mode: Manual";
timingInfoEl.textContent = "Timing: Auto";
sourceInfoEl.textContent = "Source: Manual";
sessionInfoEl.textContent = "Session: Off Session";
selectedPairText.textContent = "No pair selected";
