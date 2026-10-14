/* ============================================================
   Kya Banaye — app.js
   Change APP_NAME below to rename the app everywhere in the UI
   that reads from this constant.
   ============================================================ */
const APP_NAME = "Kya Banaye";

/* ---------- Recipe database ----------
   Each recipe: id, name, meal, time (minutes), tags, ingredients,
   advancePrep (tip for the night before / for tomorrow's meal). */
const RECIPES = [
  // ---------------- BREAKFAST ----------------
  { id: "b1", meal: "breakfast", name: "Vegetable Poha", time: 15, tags: ["quick", "light"],
    ingredients: ["flattened rice (poha)", "onion", "peanuts", "mustard seeds", "curry leaves", "turmeric", "lemon"],
    advancePrep: "Soak poha for 5 minutes just before cooking — don't soak it the night before, it turns mushy. Chop onions tonight and keep covered in the fridge." },
  { id: "b2", meal: "breakfast", name: "Vegetable Upma", time: 20, tags: ["quick", "light"],
    ingredients: ["semolina (rava)", "mixed vegetables", "mustard seeds", "urad dal", "curry leaves", "ginger"],
    advancePrep: "Dry-roast the semolina the night before and store in an airtight jar — cuts 5 minutes off tomorrow's cooking." },
  { id: "b3", meal: "breakfast", name: "Stuffed Paratha (Aloo)", time: 30, tags: ["protein", "festive"],
    ingredients: ["wheat flour", "potato", "green chilli", "coriander", "ghee/oil", "curd"],
    advancePrep: "Boil and mash the potato filling tonight, and knead the dough — keep both covered in the fridge. Rolling in the morning takes 10 minutes." },
  { id: "b4", meal: "breakfast", name: "Moong Dal Chilla", time: 20, tags: ["protein", "quick"],
    ingredients: ["split moong dal", "ginger", "green chilli", "coriander", "onion", "oil"],
    advancePrep: "Soak moong dal for 3–4 hours before grinding — soak it first thing in the morning, or overnight if you're up early." },
  { id: "b5", meal: "breakfast", name: "Idli with Sambar", time: 25, tags: ["light", "protein"],
    ingredients: ["idli batter (rice+urad dal)", "toor dal", "mixed vegetables", "sambar powder", "tamarind"],
    advancePrep: "Ferment idli batter overnight — mix rice and urad dal batter this evening and leave it out to ferment." },
  { id: "b6", meal: "breakfast", name: "Vegetable Dalia (Broken Wheat)", time: 20, tags: ["light", "quick"],
    ingredients: ["broken wheat (dalia)", "mixed vegetables", "cumin", "ghee"],
    advancePrep: "Chop the vegetables the night before and refrigerate in an airtight box." },
  { id: "b7", meal: "breakfast", name: "Besan Cheela with Curd", time: 15, tags: ["quick", "protein"],
    ingredients: ["besan (gram flour)", "onion", "tomato", "green chilli", "curd"],
    advancePrep: "Mix the besan batter the night before and refrigerate — just whisk again before cooking." },
  { id: "b8", meal: "breakfast", name: "Sprouted Moong Salad + Toast", time: 10, tags: ["quick", "protein", "light"],
    ingredients: ["sprouted moong", "cucumber", "tomato", "lemon", "bread"],
    advancePrep: "Soak and sprout the moong 1–2 days ahead — soak overnight, drain, and leave tied in a damp cloth." },

  // ---------------- LUNCH ----------------
  { id: "l1", meal: "lunch", name: "Rajma Chawal", time: 40, tags: ["protein", "festive"],
    ingredients: ["kidney beans (rajma)", "onion", "tomato", "ginger-garlic", "rice", "garam masala"],
    advancePrep: "Soak rajma overnight — it cooks in a third of the time tomorrow and digests easier too." },
  { id: "l2", meal: "lunch", name: "Dal Tadka with Steamed Rice", time: 30, tags: ["protein", "quick", "light"],
    ingredients: ["toor dal or moong dal", "tomato", "cumin", "garlic", "ghee", "rice"],
    advancePrep: "Pressure-cook the dal a day ahead if you like — it tastes better the next day, just temper it fresh." },
  { id: "l3", meal: "lunch", name: "Bhindi Masala with Roti", time: 25, tags: ["light", "quick"],
    ingredients: ["okra (bhindi)", "onion", "tomato", "besan", "wheat flour"],
    advancePrep: "Wash and completely dry the bhindi the night before — this is the trick to non-sticky bhindi. Store uncut in the fridge." },
  { id: "l4", meal: "lunch", name: "Chole with Bhature or Rice", time: 45, tags: ["protein", "festive"],
    ingredients: ["chickpeas (chole)", "onion", "tomato", "chole masala", "wheat flour or rice"],
    advancePrep: "Soak chickpeas overnight — non-negotiable for good chole. Knead bhature dough in the morning if using." },
  { id: "l5", meal: "lunch", name: "Palak Paneer with Roti", time: 35, tags: ["protein", "festive"],
    ingredients: ["spinach", "paneer", "onion", "tomato", "ginger-garlic", "cream/curd", "wheat flour"],
    advancePrep: "Blanch and puree the spinach tonight, refrigerate — tomorrow's cooking drops to 15 minutes." },
  { id: "l6", meal: "lunch", name: "Mixed Vegetable Curry with Rice", time: 30, tags: ["light", "quick"],
    ingredients: ["seasonal vegetables", "onion", "tomato", "cumin", "coriander powder", "rice"],
    advancePrep: "Chop all vegetables the previous evening and store in one airtight box — grab and cook." },
  { id: "l7", meal: "lunch", name: "Curd Rice with Tempering", time: 15, tags: ["quick", "light"],
    ingredients: ["rice", "curd", "mustard seeds", "curry leaves", "green chilli", "pomegranate (optional)"],
    advancePrep: "Cook extra rice the night before specifically for this — day-old rice actually works best for curd rice." },
  { id: "l8", meal: "lunch", name: "Lauki (Bottle Gourd) Chana Dal", time: 30, tags: ["light", "protein"],
    ingredients: ["bottle gourd (lauki)", "chana dal", "onion", "tomato", "cumin"],
    advancePrep: "Soak chana dal for at least 1 hour — soak it first thing when you start your morning routine." },
  { id: "l9", meal: "lunch", name: "Vegetable Pulao with Raita", time: 30, tags: ["quick", "festive"],
    ingredients: ["rice", "mixed vegetables", "whole spices", "curd", "cucumber"],
    advancePrep: "Chop vegetables and soak rice for 20 minutes the next morning — or prep the veg the night before." },

  // ---------------- DINNER ----------------
  { id: "d1", meal: "dinner", name: "Khichdi with Ghee", time: 30, tags: ["light", "quick"],
    ingredients: ["rice", "moong dal", "turmeric", "cumin", "ghee", "vegetables (optional)"],
    advancePrep: "A gentle choice after a heavy lunch. Wash and soak rice-dal together 20 minutes before cooking." },
  { id: "d2", meal: "dinner", name: "Vegetable Soup with Toast", time: 20, tags: ["light", "quick"],
    ingredients: ["mixed vegetables", "garlic", "pepper", "bread"],
    advancePrep: "Chop and refrigerate soup vegetables the previous evening for a genuinely 15-minute dinner." },
  { id: "d3", meal: "dinner", name: "Paneer Bhurji with Roti", time: 20, tags: ["protein", "quick"],
    ingredients: ["paneer", "onion", "tomato", "capsicum", "wheat flour"],
    advancePrep: "Crumble the paneer and chop vegetables the night before if lunch was heavy on prep time." },
  { id: "d4", meal: "dinner", name: "Mixed Dal with Jeera Rice", time: 30, tags: ["protein", "light"],
    ingredients: ["mixed dals", "cumin", "rice", "ghee", "coriander"],
    advancePrep: "Soak the dals for 30 minutes while you wind down after lunch cleanup — cooks faster and is easier to digest at night." },
  { id: "d5", meal: "dinner", name: "Vegetable Stir-fry with Multigrain Roti", time: 20, tags: ["light", "quick"],
    ingredients: ["seasonal vegetables", "garlic", "soy sauce (optional)", "multigrain flour"],
    advancePrep: "Knead multigrain dough a little softer and rest it 15 minutes for softer rotis at night." },
  { id: "d6", meal: "dinner", name: "Tomato Rasam with Rice", time: 20, tags: ["light", "quick"],
    ingredients: ["tomato", "tamarind", "rasam powder", "curry leaves", "rice"],
    advancePrep: "Make a double batch of rasam powder mix once a month and store it — turns this into a 15-minute dinner anytime." },
  { id: "d7", meal: "dinner", name: "Methi Thepla with Curd", time: 25, tags: ["light", "festive"],
    ingredients: ["wheat flour", "fenugreek leaves (methi)", "curd", "besan", "spices"],
    advancePrep: "Wash and chop methi leaves the night before, pat completely dry, and refrigerate in a cloth-lined box." },
];

const INGREDIENT_MASTER = {
  "Grains & flours": ["rice", "wheat flour", "besan (gram flour)", "semolina (rava)", "broken wheat (dalia)", "multigrain flour", "poha (flattened rice)"],
  "Dals & legumes": ["toor dal", "moong dal", "chana dal", "urad dal", "rajma (kidney beans)", "chickpeas (chole)", "sprouted moong"],
  "Vegetables": ["onion", "tomato", "potato", "okra (bhindi)", "spinach", "bottle gourd (lauki)", "capsicum", "fenugreek leaves (methi)", "mixed seasonal vegetables"],
  "Dairy": ["curd", "paneer", "ghee", "milk"],
  "Spices & aromatics": ["ginger-garlic", "green chilli", "curry leaves", "mustard seeds", "cumin", "turmeric", "garam masala", "coriander"],
};

/* ---------- State ---------- */
const state = {
  route: "home",
  goal: "any",
  useKitchenOnly: false,
  kitchen: loadJSON("kitchen", []),
  history: loadJSON("history", { breakfast: [], lunch: [], dinner: [] }),
  today: loadJSON("today", { breakfast: null, lunch: null, dinner: null }),
  tomorrow: loadJSON("tomorrow", { breakfast: null, lunch: null, dinner: null }),
  todayDate: loadJSON("todayDate", null),
  tomorrowDate: loadJSON("tomorrowDate", null),
  cookedLog: loadJSON("cookedLog", {}),
  repeatDays: loadJSON("repeatDays", 4),
  favorites: loadJSON("favorites", []),
  interactionCount: loadJSON("interactionCount", 0),
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem("akb_" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem("akb_" + key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

/* ---------- Dates & cooked log ---------- */
function emptyDay() { return { breakfast: null, lunch: null, dinner: null }; }

/* Local-time date as YYYY-MM-DD (offset 1 = tomorrow, -1 = yesterday). */
function dateKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* A new day has started: the plan made for "tomorrow" becomes today's menu. */
function rolloverIfNeeded() {
  const t = dateKey();
  if (state.todayDate === t) return;
  state.today = state.tomorrowDate === t ? state.tomorrow : emptyDay();
  state.todayDate = t;
  if (state.tomorrowDate === null || state.tomorrowDate <= t) {
    state.tomorrow = emptyDay();
    state.tomorrowDate = null;
  }
  saveJSON("today", state.today);
  saveJSON("todayDate", state.todayDate);
  saveJSON("tomorrow", state.tomorrow);
  saveJSON("tomorrowDate", state.tomorrowDate);
}

function isCooked(meal) {
  const day = state.cookedLog[dateKey()];
  return !!(day && state.today[meal] && day[meal] === state.today[meal].id);
}

function setCooked(meal, on) {
  const k = dateKey();
  if (on && state.today[meal]) {
    state.cookedLog[k] = state.cookedLog[k] || {};
    state.cookedLog[k][meal] = state.today[meal].id;
  } else if (state.cookedLog[k]) {
    delete state.cookedLog[k][meal];
    if (!Object.keys(state.cookedLog[k]).length) delete state.cookedLog[k];
  }
  saveJSON("cookedLog", state.cookedLog);
}

/* Map of dish id -> days ago it was cooked, for the last `days` days (0 = today). */
function recentlyCookedIds(days) {
  const out = new Map();
  for (let i = 0; i < days; i++) {
    const day = state.cookedLog[dateKey(-i)];
    if (day) Object.values(day).forEach(id => { if (!out.has(id)) out.set(id, i); });
  }
  return out;
}

function updateRepeatNote() {
  const note = document.getElementById("repeatNote");
  const cooked = recentlyCookedIds(state.repeatDays);
  const show = ["breakfast", "lunch", "dinner"].some(m => state.today[m] && !isCooked(m) && cooked.has(state.today[m].id));
  note.hidden = !show;
  if (show) note.textContent = tr("repeatNote");
}
/* ---------- Suggestion engine ---------- */
/* Compares a recipe ingredient with a "My Kitchen" item. Ignores bracketed
   alternate names, splits "a/b", "a or b", "a-b", drops mixed / seasonal / split / optional. */
function ingredientKeys(s) {
  return s.toLowerCase()
    .replace(/\b(mixed|seasonal|split|whole|optional)\b/g, " ")
    .split(/[()\/+\-]| or /)
    .map(t => t.trim())
    .filter(t => t.length >= 3);
}
function ingredientMatches(a, b) {
  const A = ingredientKeys(a), B = ingredientKeys(b);
  return A.some(x => B.includes(x));
}
function pickRecipe(meal) {
  let pool = RECIPES.filter(r => r.meal === meal);

  // Dishes you confirmed cooking in the last N days are set aside. If the
  // recipe list is too small for that, offer the one cooked longest ago.
  const cooked = recentlyCookedIds(state.repeatDays);
  const notRecent = pool.filter(r => !cooked.has(r.id));
  if (notRecent.length) {
    pool = notRecent;
  } else {
    const longestAgo = Math.max(...pool.map(r => cooked.get(r.id)));
    pool = pool.filter(r => cooked.get(r.id) === longestAgo);
  }
  if (state.goal !== "any") {
    const goalPool = pool.filter(r => r.tags.includes(state.goal));
    if (goalPool.length) pool = goalPool;
  }

  if (state.useKitchenOnly && state.kitchen.length) {
    const kitchenPool = pool.filter(r =>
      r.ingredients.filter(ing => state.kitchen.some(k => ingredientMatches(ing, k))).length >= Math.ceil(r.ingredients.length * 0.5)
    );
    if (kitchenPool.length) pool = kitchenPool;
  }

  const recent = state.history[meal].slice(-3);
  const freshPool = pool.filter(r => !recent.includes(r.id));
  const finalPool = freshPool.length ? freshPool : pool;

  const chosen = finalPool[Math.floor(Math.random() * finalPool.length)];
  return chosen;
}

function recordChoice(target, meal, recipe) {
  state[target][meal] = recipe;
  if (target === "today") { state.todayDate = dateKey(); saveJSON("todayDate", state.todayDate); }
  else { state.tomorrowDate = dateKey(1); saveJSON("tomorrowDate", state.tomorrowDate); }
  state.history[meal].push(recipe.id);
  state.history[meal] = state.history[meal].slice(-6);
  saveJSON("history", state.history);
  saveJSON(target, state[target]);
}

function suggestAll() {
  ["breakfast", "lunch", "dinner"].filter(meal => !isCooked(meal)).forEach(meal => recordChoice("today", meal, pickRecipe(meal)));
  bumpInteraction();
  renderHome();
}

function suggestAllTomorrow() {
  ["breakfast", "lunch", "dinner"].forEach(meal => recordChoice("tomorrow", meal, pickRecipe(meal)));
  bumpInteraction();
  renderPlanAhead();
}

function bumpInteraction() {
  state.interactionCount++;
  saveJSON("interactionCount", state.interactionCount);
  // Light-touch monetization hook: surface the premium modal occasionally,
  // never on the very first visit, never more than the user tolerates.
  if (state.interactionCount === 6) openPremiumModal();
}

/* ---------- Rendering: Home ---------- */
function mealCardHTML(meal, recipe) {
  if (!recipe) return "";
  const isFav = state.favorites.includes(recipe.id);
  const done = isCooked(meal);
  return `
    <article class="meal-card${done ? " is-cooked" : ""}" data-meal="${meal}">
      <span class="meal-label">${labelFor(meal)}${done ? " · " + tr("cookedBadge") : ""}</span>
      <h3 class="meal-name">${tName(recipe)}</h3>
      <div class="meal-meta">
        <span>${recipe.time} ${tr("min")}</span>
        ${recipe.tags.map(t => `<span>${tagLabel(t)}</span>`).join("")}
      </div>
      <p class="meal-ingredients"><strong>${tr("needs")}</strong> ${tIngList(recipe)}</p>
      <div class="meal-actions">
        ${done ? "" : `<button class="icon-btn" data-action="reshuffle" data-meal="${meal}">${tr("tryAnother")}</button>`}
        <button class="icon-btn" data-action="favorite" data-id="${recipe.id}">${isFav ? tr("saved") : tr("save")}</button>
        <button class="icon-btn${done ? "" : " icon-btn-primary"}" data-action="cooked" data-meal="${meal}">${done ? tr("undoCooked") : tr("cookedThis")}</button>
      </div>
    </article>`;
}

function labelFor(meal) { return tr("meal_" + meal); }
function tagLabel(tag) { return tr("tag_" + tag) || tag; }

function renderHome() {
  ["breakfast", "lunch", "dinner"].forEach(meal => {
    if (!state.today[meal]) recordChoice("today", meal, pickRecipe(meal));
  });
  const grid = document.getElementById("thaliGrid");
  grid.innerHTML = ["breakfast", "lunch", "dinner"].map(meal => mealCardHTML(meal, state.today[meal])).join("");
  updateRepeatNote();
}

/* ---------- Rendering: Ingredients ---------- */
function renderIngredients(live) {
  // `live` (optional) = ticks not yet saved, kept when the language is switched.
  const isOn = item => (live ? live.has(item) : state.kitchen.includes(item));
  const wrap = document.getElementById("ingredientGroups");
  wrap.innerHTML = Object.entries(INGREDIENT_MASTER).map(([group, items]) => `
    <div class="ingredient-group">
      <h3>${tGroup(group)}</h3>
      ${items.map(item => `
        <label class="ingredient-item">
          <input type="checkbox" value="${item}" ${isOn(item) ? "checked" : ""} />
          ${tIng(item)}
        </label>`).join("")}
    </div>`).join("");
}

/* ---------- Rendering: Recipe book ---------- */
let recipeFilter = "all";
function renderRecipes() {
  const q = (document.getElementById("recipeSearch")?.value || "").trim().toLowerCase();
  const list = RECIPES.filter(r => recipeFilter === "all" || r.meal === recipeFilter)
    .filter(r => !q || searchText(r).includes(q));

  document.getElementById("recipeList").innerHTML = list.map(r => `
    <article class="recipe-card" data-meal="${r.meal}">
      <span class="meal-label">${labelFor(r.meal)}</span>
      <h3>${tName(r)}</h3>
      <div class="meal-meta"><span>${r.time} ${tr("min")}</span>${r.tags.map(t => `<span>${tagLabel(t)}</span>`).join("")}</div>
      <p class="meal-ingredients"><strong>${tr("needs")}</strong> ${tIngList(r)}</p>
      <p class="meal-prep"><strong>${tr("advancePrep")}</strong> ${tPrep(r)}</p>
    </article>`).join("") || `<p>${tr("noMatch")}</p>`;
}

/* ---------- Rendering: Plan ahead ----------
   This tab is deliberately about TOMORROW's menu, not today's. */
function renderPlanAhead() {
  ["breakfast", "lunch", "dinner"].forEach(meal => {
    if (!state.tomorrow[meal]) recordChoice("tomorrow", meal, pickRecipe(meal));
  });
  const list = document.getElementById("planaheadList");
  list.innerHTML = ["breakfast", "lunch", "dinner"].map(meal => {
    const r = state.tomorrow[meal];
    return `
      <div class="planahead-item" data-meal="${meal}">
        <span class="meal-label">${tr("tomorrowsMeal", labelFor(meal), tName(r))}</span>
        <h3>${tr("prepTonight")}</h3>
        <p>${tPrep(r)}</p>
        <div class="meal-actions">
          <button class="icon-btn" data-action="reshuffle-tomorrow" data-meal="${meal}">${tr("tryAnother")}</button>
        </div>
      </div>`;
  }).join("");
}

/* ---------- Rendering: History ---------- */
function recipeById(id) { return RECIPES.find(r => r.id === id); }

function formatDay(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(currentLang === "hi" ? "hi-IN" : "en-IN",
    { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function renderRepeatSelect() {
  const sel = document.getElementById("repeatDays");
  sel.innerHTML = [2, 3, 4, 5, 7, 10, 14].map(n =>
    `<option value="${n}"${n === state.repeatDays ? " selected" : ""}>${tr("days", n)}</option>`).join("");
}

function renderHistory() {
  const recent = [];
  for (let i = 0; i < 7; i++) {
    const day = state.cookedLog[dateKey(-i)];
    if (day) recent.push(...Object.values(day));
  }
  const summary = document.getElementById("historySummary");
  summary.hidden = !recent.length;
  if (recent.length) summary.textContent = tr("weekSummary", recent.length, new Set(recent).size);

  const keys = Object.keys(state.cookedLog).sort().reverse();
  document.getElementById("historyList").innerHTML = keys.length ? keys.map(key => `
    <div class="history-day">
      <h3>${formatDay(key)}</h3>
      ${["breakfast", "lunch", "dinner"].filter(m => state.cookedLog[key][m]).map(m => {
        const r = recipeById(state.cookedLog[key][m]);
        return `<div class="history-row" data-meal="${m}"><span class="meal-label">${labelFor(m)}</span><span class="history-dish">${r ? tName(r) : state.cookedLog[key][m]}</span></div>`;
      }).join("")}
    </div>`).join("") : `<p>${tr("historyEmpty")}</p>`;
}
/* ---------- Routing ---------- */
  function goTo(route) {
  const before = state.todayDate;
  rolloverIfNeeded();                       // a new day may have started
  if (state.todayDate !== before) renderHome();
  state.route = route;
  document.querySelectorAll(".view").forEach(v => v.hidden = v.dataset.view !== route);
  // Keep the desktop top nav AND the mobile bottom tab bar in sync with each other.
  document.querySelectorAll(".nav-link[data-route], .bottom-tab[data-route]").forEach(b => {
    b.classList.toggle("is-active", b.dataset.route === route);
  });
  document.getElementById("primaryNav").classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "auto" });
  if (route === "recipes") renderRecipes();
  if (route === "ingredients") renderIngredients();
  if (route === "planahead") renderPlanAhead();
  if (route === "history") renderHistory();
}

/* ---------- Kitchen-only hint ----------
   "Only suggest from My Kitchen" has nothing to filter by until ingredients
   have actually been saved on the My Kitchen tab — without this, ticking it
   silently does nothing and looks broken. */
function updateKitchenEmptyHint() {
  const hint = document.getElementById("kitchenEmptyHint");
  const show = state.useKitchenOnly && state.kitchen.length === 0;
  hint.hidden = !show;
  if (show) hint.textContent = tr("kitchenEmptyHint");
}

/* ---------- Premium modal ---------- */
function openPremiumModal() { document.getElementById("premiumModal").hidden = false; }
function closePremiumModal() { document.getElementById("premiumModal").hidden = true; }

/* ---------- Event wiring ---------- */
function wireEvents() {
    // One listener for every [data-route] element (keeps working after text is re-translated).
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-route]");
    if (el) goTo(el.dataset.route);
  });

  document.getElementById("langToggle").addEventListener("click", () => {
    setLang(currentLang === "en" ? "hi" : "en");
  });

  document.getElementById("navToggle").addEventListener("click", () => {
    const nav = document.getElementById("primaryNav");
    const open = nav.classList.toggle("is-open");
    document.getElementById("navToggle").setAttribute("aria-expanded", open);
  });

    document.getElementById("goalSelect").addEventListener("change", e => {
    state.goal = e.target.value;
    suggestAll();
  });
  document.getElementById("useKitchenOnly").addEventListener("change", e => {
    state.useKitchenOnly = e.target.checked;
    updateKitchenEmptyHint();
    suggestAll();
  });

  document.getElementById("regenAll").addEventListener("click", suggestAll);
  document.getElementById("regenTomorrow").addEventListener("click", suggestAllTomorrow);
  document.getElementById("repeatDays").addEventListener("change", e => {
    state.repeatDays = Number(e.target.value);
    saveJSON("repeatDays", state.repeatDays);
    updateRepeatNote();
  });
  document.getElementById("thaliGrid").addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    if (btn.dataset.action === "reshuffle") {
      const meal = btn.dataset.meal;
      recordChoice("today", meal, pickRecipe(meal));
      bumpInteraction();
      renderHome();
    }
      if (btn.dataset.action === "cooked") {
      setCooked(btn.dataset.meal, !isCooked(btn.dataset.meal));
      renderHome();
    }
    if (btn.dataset.action === "favorite") {
      const id = btn.dataset.id;
      const idx = state.favorites.indexOf(id);
      if (idx >= 0) state.favorites.splice(idx, 1); else state.favorites.push(id);
      saveJSON("favorites", state.favorites);
      renderHome();
    }
  });

  document.getElementById("planaheadList").addEventListener("click", e => {
    const btn = e.target.closest('button[data-action="reshuffle-tomorrow"]');
    if (!btn) return;
    recordChoice("tomorrow", btn.dataset.meal, pickRecipe(btn.dataset.meal));
    bumpInteraction();
    renderPlanAhead();
  });

  document.getElementById("saveIngredients").addEventListener("click", () => {
    const checked = Array.from(document.querySelectorAll("#ingredientGroups input:checked")).map(i => i.value);
    state.kitchen = checked;
    saveJSON("kitchen", state.kitchen);
    updateKitchenEmptyHint();
    if (state.useKitchenOnly) suggestAll();
    const hint = document.getElementById("saveHint");
    hint.textContent = tr("savedDevice");
    setTimeout(() => hint.textContent = "", 2500);
  });

  document.querySelectorAll(".chip[data-meal]").forEach(chip => {
    chip.addEventListener("click", () => {
      recipeFilter = chip.dataset.meal;
      document.querySelectorAll(".chip[data-meal]").forEach(c => c.classList.toggle("is-active", c === chip));
      renderRecipes();
    });
  });
  document.getElementById("recipeSearch").addEventListener("input", renderRecipes);

  document.getElementById("premiumClose").addEventListener("click", closePremiumModal);
  document.getElementById("premiumModal").addEventListener("click", e => { if (e.target.id === "premiumModal") closePremiumModal(); });
  document.getElementById("premiumNotify").addEventListener("click", () => {
    // Wire this to your real email-capture or payment flow.
    document.getElementById("premiumNotify").textContent = tr("notifyThanks");
  });
}

/* Called by setLang() in lang.js after the language changes. */
function rerenderCurrent() {
  renderHome();
  if (state.route === "recipes") renderRecipes();
  if (state.route === "planahead") renderPlanAhead();
  if (state.route === "history") renderHistory();
  renderRepeatSelect(); 
  if (state.route === "ingredients") {
  const live = new Set(Array.from(document.querySelectorAll("#ingredientGroups input:checked")).map(i => i.value));
  renderIngredients(live);
  }
  updateKitchenEmptyHint();
}

/* ---------- Init ---------- */
function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  wireEvents();
  applyStaticLang();
    rolloverIfNeeded();
  updateKitchenEmptyHint();
  renderRepeatSelect();
  renderHome();
  goTo("home");

  // Coming back to the app after hours or overnight: start the new day.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    const before = state.todayDate;
    rolloverIfNeeded();
    if (state.todayDate !== before) rerenderCurrent();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => { /* offline caching unavailable */ });
  }
}

document.addEventListener("DOMContentLoaded", init);
