/* ============================================================
   Kya Banaye — lang.js  (English / Hindi)
   Load this BEFORE app.js.

   - STATIC_HI : Hindi for everything written directly in index.html
   - UI        : short strings that app.js builds at run time
   - RECIPES_HI / ING_HI / GROUP_HI : Hindi recipe names, tips, ingredients
   English is never deleted from index.html — it is remembered on first
   run, so switching back restores it exactly.
   ============================================================ */

const LANG_STORAGE_KEY = "akb_lang";
let currentLang = "en";
try {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === "hi" || saved === "en") currentLang = saved;
} catch (e) { /* storage unavailable: stay on English */ }

/* ---------- Small run-time strings ---------- */
const UI = {
  en: {
    meal_breakfast: "Breakfast", meal_lunch: "Lunch", meal_dinner: "Dinner",
    tag_quick: "Quick", tag_light: "Light", tag_protein: "Protein-rich", tag_festive: "A little special",
    min: "min",
    needs: "Needs:",
    tryAnother: "Try another",
    save: "☆ Save",
    saved: "★ Saved",
    advancePrep: "Advance prep:",
    prepTonight: "Prep tonight",
    tomorrowsMeal: (meal, name) => `Tomorrow's ${meal} — ${name}`,
    noMatch: "No recipes match that search yet.",
    savedDevice: "Saved to this device.",
    notifyThanks: "Thanks — we'll let you know!",
    kitchenEmptyHint: "Add a few items in My Kitchen first, then this will narrow things down.",
  },
  hi: {
    meal_breakfast: "नाश्ता", meal_lunch: "दोपहर का खाना", meal_dinner: "रात का खाना",
    tag_quick: "जल्दी बनने वाला", tag_light: "हल्का", tag_protein: "प्रोटीन से भरपूर", tag_festive: "कुछ ख़ास",
    min: "मिनट",
    needs: "सामग्री:",
    tryAnother: "दूसरा दिखाएँ",
    save: "☆ सेव करें",
    saved: "★ सेव किया",
    advancePrep: "पहले से तैयारी:",
    prepTonight: "आज रात की तैयारी",
    tomorrowsMeal: (meal, name) => `कल का ${meal} — ${name}`,
    noMatch: "इस खोज से कोई रेसिपी नहीं मिली।",
    savedDevice: "इस डिवाइस पर सेव हो गया।",
    notifyThanks: "धन्यवाद — हम आपको बता देंगे!",
    kitchenEmptyHint: "पहले \"मेरी रसोई\" में कुछ सामग्री जोड़ें, फिर यह सुझावों को सीमित कर पाएगा।",
  },
};

function tr(key, ...args) {
  const pack = UI[currentLang] || UI.en;
  const v = pack[key] !== undefined ? pack[key] : UI.en[key];
  return typeof v === "function" ? v(...args) : v;
}

/* ---------- Hindi recipe content (keyed by recipe id) ---------- */
const RECIPES_HI = {
  b1: { name: "सब्ज़ी वाला पोहा", prep: "पोहा को बनाने से बस 5 मिनट पहले भिगोएँ — रात भर न भिगोएँ, वरना गल जाएगा। प्याज़ आज रात काटकर ढककर फ्रिज में रख दें।" },
  b2: { name: "सब्ज़ी उपमा", prep: "रवा को रात में ही सूखा भून लें और एयरटाइट डिब्बे में रखें — कल सुबह 5 मिनट बचेंगे।" },
  b3: { name: "आलू पराठा", prep: "आलू की स्टफिंग आज रात उबालकर मैश कर लें और आटा गूंध लें — दोनों को ढककर फ्रिज में रखें। सुबह बेलने में सिर्फ़ 10 मिनट लगेंगे।" },
  b4: { name: "मूंग दाल चीला", prep: "मूंग दाल को पीसने से 3–4 घंटे पहले भिगो दें — सुबह सबसे पहले भिगो दें, या जल्दी उठते हों तो रात में।" },
  b5: { name: "इडली सांभर", prep: "इडली के घोल को रात भर खमीर उठने दें — आज शाम चावल-उड़द का घोल मिलाकर बाहर रख दें।" },
  b6: { name: "सब्ज़ी दलिया", prep: "सब्ज़ियाँ रात को ही काटकर एयरटाइट डिब्बे में फ्रिज में रख दें।" },
  b7: { name: "बेसन चीला और दही", prep: "बेसन का घोल रात में बनाकर फ्रिज में रख दें — बनाने से पहले बस एक बार फेंट लें।" },
  b8: { name: "अंकुरित मूंग सलाद और टोस्ट", prep: "मूंग को 1–2 दिन पहले भिगोकर अंकुरित कर लें — रात भर भिगोएँ, पानी निथारें और गीले कपड़े में बाँधकर रख दें।" },
  l1: { name: "राजमा चावल", prep: "राजमा रात भर भिगो दें — कल पकने में एक-तिहाई समय लगेगा और पचने में भी आसान होगा।" },
  l2: { name: "दाल तड़का और चावल", prep: "चाहें तो दाल एक दिन पहले कुकर में पका लें — अगले दिन और स्वादिष्ट लगती है, बस तड़का ताज़ा लगाएँ।" },
  l3: { name: "भिंडी मसाला और रोटी", prep: "भिंडी को रात में धोकर पूरी तरह सुखा लें — यही चिपचिपाहट न होने का राज़ है। बिना काटे फ्रिज में रखें।" },
  l4: { name: "छोले भटूरे या चावल", prep: "छोले रात भर ज़रूर भिगोएँ — अच्छे छोलों के लिए यह ज़रूरी है। भटूरे बनाने हों तो आटा सुबह गूंधें।" },
  l5: { name: "पालक पनीर और रोटी", prep: "पालक को आज रात ब्लांच करके प्यूरी बना लें और फ्रिज में रखें — कल का खाना 15 मिनट में तैयार।" },
  l6: { name: "मिक्स सब्ज़ी और चावल", prep: "सारी सब्ज़ियाँ पिछली शाम काटकर एक ही एयरटाइट डिब्बे में रख लें — निकालें और पकाएँ।" },
  l7: { name: "तड़के वाला दही चावल", prep: "इसके लिए रात में ही थोड़ा ज़्यादा चावल बना लें — बासी चावल से दही चावल सबसे अच्छा बनता है।" },
  l8: { name: "लौकी चना दाल", prep: "चना दाल को कम से कम 1 घंटा भिगोएँ — सुबह की दिनचर्या शुरू करते ही भिगो दें।" },
  l9: { name: "वेज पुलाव और रायता", prep: "सब्ज़ियाँ काटकर और चावल 20 मिनट भिगोकर अगली सुबह तैयार करें — या सब्ज़ियाँ रात में ही काट लें।" },
  d1: { name: "घी वाली खिचड़ी", prep: "भारी दोपहर के खाने के बाद यह हल्का विकल्प है। चावल और दाल को पकाने से 20 मिनट पहले साथ में धोकर भिगो दें।" },
  d2: { name: "सब्ज़ी सूप और टोस्ट", prep: "सूप की सब्ज़ियाँ पिछली शाम काटकर फ्रिज में रख दें — डिनर सचमुच 15 मिनट में बन जाएगा।" },
  d3: { name: "पनीर भुर्जी और रोटी", prep: "पनीर क्रम्बल करके और सब्ज़ियाँ काटकर एक रात पहले रख लें, खासकर जब दोपहर के खाने में तैयारी में ज़्यादा समय लगा हो।" },
  d4: { name: "मिक्स दाल और जीरा राइस", prep: "दोपहर के बर्तन समेटते समय दालों को 30 मिनट भिगो दें — जल्दी पकेंगी और रात में पचने में भी आसान रहेंगी।" },
  d5: { name: "स्टिर-फ्राई सब्ज़ी और मल्टीग्रेन रोटी", prep: "मल्टीग्रेन आटा थोड़ा नरम गूंधें और 15 मिनट ढककर रखें — रात की रोटियाँ ज़्यादा मुलायम बनेंगी।" },
  d6: { name: "टमाटर रसम और चावल", prep: "रसम पाउडर महीने में एक बार दोगुना बनाकर रख लें — फिर यह कभी भी 15 मिनट का डिनर बन जाता है।" },
  d7: { name: "मेथी थेपला और दही", prep: "मेथी के पत्ते रात में धोकर काट लें, अच्छी तरह पोंछकर सुखा लें और कपड़ा बिछे डिब्बे में फ्रिज में रखें।" },
};

const ING_HI = {
  "besan": "बेसन",
  "besan (gram flour)": "बेसन",
  "bottle gourd (lauki)": "लौकी",
  "bread": "ब्रेड",
  "broken wheat (dalia)": "दलिया",
  "capsicum": "शिमला मिर्च",
  "chana dal": "चना दाल",
  "chickpeas (chole)": "छोले (काबुली चना)",
  "chole masala": "छोले मसाला",
  "coriander": "हरा धनिया",
  "coriander powder": "धनिया पाउडर",
  "cream/curd": "मलाई/दही",
  "cucumber": "खीरा",
  "cumin": "जीरा",
  "curd": "दही",
  "curry leaves": "कढ़ी पत्ता",
  "fenugreek leaves (methi)": "मेथी के पत्ते",
  "flattened rice (poha)": "पोहा",
  "garam masala": "गरम मसाला",
  "garlic": "लहसुन",
  "ghee": "घी",
  "ghee/oil": "घी/तेल",
  "ginger": "अदरक",
  "ginger-garlic": "अदरक-लहसुन",
  "green chilli": "हरी मिर्च",
  "idli batter (rice+urad dal)": "इडली का घोल (चावल + उड़द दाल)",
  "kidney beans (rajma)": "राजमा",
  "lemon": "नींबू",
  "milk": "दूध",
  "mixed dals": "मिक्स दालें",
  "mixed seasonal vegetables": "मिक्स मौसमी सब्ज़ियाँ",
  "mixed vegetables": "मिक्स सब्ज़ियाँ",
  "moong dal": "मूंग दाल",
  "multigrain flour": "मल्टीग्रेन आटा",
  "mustard seeds": "राई (सरसों के दाने)",
  "oil": "तेल",
  "okra (bhindi)": "भिंडी",
  "onion": "प्याज़",
  "paneer": "पनीर",
  "peanuts": "मूंगफली",
  "pepper": "काली मिर्च",
  "poha (flattened rice)": "पोहा",
  "pomegranate (optional)": "अनार (वैकल्पिक)",
  "potato": "आलू",
  "rajma (kidney beans)": "राजमा",
  "rasam powder": "रसम पाउडर",
  "rice": "चावल",
  "sambar powder": "सांभर पाउडर",
  "seasonal vegetables": "मौसमी सब्ज़ियाँ",
  "semolina (rava)": "सूजी (रवा)",
  "soy sauce (optional)": "सोया सॉस (वैकल्पिक)",
  "spices": "मसाले",
  "spinach": "पालक",
  "split moong dal": "मूंग दाल (धुली)",
  "sprouted moong": "अंकुरित मूंग",
  "tamarind": "इमली",
  "tomato": "टमाटर",
  "toor dal": "अरहर (तूर) दाल",
  "toor dal or moong dal": "अरहर (तूर) दाल या मूंग दाल",
  "turmeric": "हल्दी",
  "urad dal": "उड़द दाल",
  "vegetables (optional)": "सब्ज़ियाँ (वैकल्पिक)",
  "wheat flour": "गेहूँ का आटा",
  "wheat flour or rice": "गेहूँ का आटा या चावल",
  "whole spices": "साबुत मसाले",
};

const GROUP_HI = {
  "Grains & flours": "अनाज और आटे",
  "Dals & legumes": "दालें और फलियाँ",
  "Vegetables": "सब्ज़ियाँ",
  "Dairy": "डेयरी",
  "Spices & aromatics": "मसाले और सुगंधित सामग्री",
};

/* ---------- Lookup helpers used by app.js ---------- */
function tName(r) { return currentLang === "hi" && RECIPES_HI[r.id] ? RECIPES_HI[r.id].name : r.name; }
function tPrep(r) { return currentLang === "hi" && RECIPES_HI[r.id] ? RECIPES_HI[r.id].prep : r.advancePrep; }
function tIng(s) { return currentLang === "hi" && ING_HI[s] ? ING_HI[s] : s; }
function tIngList(r) { return r.ingredients.map(tIng).join(", "); }
function tGroup(g) { return currentLang === "hi" && GROUP_HI[g] ? GROUP_HI[g] : g; }

/* Recipe-book search works in both languages, whichever one is showing. */
function searchText(r) {
  const h = RECIPES_HI[r.id];
  return [r.name, h ? h.name : "", ...r.ingredients, ...r.ingredients.map(i => ING_HI[i] || "")]
    .join(" ").toLowerCase();
}

/* ---------- Hindi text for everything written in index.html ---------- */
const STATIC_HI = [
  [".skip-link", "मुख्य सामग्री पर जाएँ"],

  // top navigation
  ['#primaryNav [data-route="home"]', "आज"],
  ['#primaryNav [data-route="ingredients"]', "मेरी रसोई"],
  ['#primaryNav [data-route="recipes"]', "रेसिपी बुक"],
  ['#primaryNav [data-route="planahead"]', "कल की योजना"],
  ['#primaryNav [data-route="about-app"]', "ऐप के बारे में"],
  ['#primaryNav [data-route="about-us"]', "हमारे बारे में"],

  // mobile bottom tabs
  ['.bottom-tab[data-route="home"] span:last-child', "आज"],
  ['.bottom-tab[data-route="ingredients"] span:last-child', "रसोई"],
  ['.bottom-tab[data-route="recipes"] span:last-child', "रेसिपी"],
  ['.bottom-tab[data-route="planahead"] span:last-child', "कल"],

  // Today
  [".eyebrow-plain", "रोज़ का सवाल, अब रोज़ का जवाब"],
  ["#view-home .hero h1", "खाने में क्या बनाना है — तय हो गया।"],
  [".hero-sub", "अपनी रसोई में जो है और आपके पास कितना समय है, बस यह बताइए। हम नाश्ते, दोपहर और रात के लिए एक सरल, सेहतमंद, शाकाहारी मेन्यू सुझाएँगे — और यह भी कि कल के लिए आज रात क्या तैयारी कर लें।"],
  ['label[for="goalSelect"]', "आज सबसे ज़रूरी क्या है?"],
  ['#goalSelect option[value="any"]', "कोई ख़ास पसंद नहीं"],
  ['#goalSelect option[value="quick"]', "जल्दी — 20 मिनट से कम"],
  ['#goalSelect option[value="light"]', "हल्का और आसानी से पचने वाला"],
  ['#goalSelect option[value="protein"]', "प्रोटीन से भरपूर"],
  ['#goalSelect option[value="festive"]', "कुछ थोड़ा ख़ास"],
  ["#kitchenOnlyText", "सिर्फ़ वही सुझाएँ जो मैं “मेरी रसोई” से बना सकूँ"],
  ["#regenAll", "तीनों बदलें"],
  [".plan-tomorrow-row .btn", "कल की योजना बनाएँ"],
  [".ad-label", "विज्ञापन"],
  [".ad-placeholder", "विज्ञापन की जगह — 728×90 / रेस्पॉन्सिव"],

  // My Kitchen
  ["#view-ingredients h1", "मेरी रसोई"],
  ["#view-ingredients .section-sub", "जो चीज़ें आपके पास आमतौर पर रहती हैं, उन पर निशान लगाइए। जितना ज़्यादा चुनेंगे, सुझाव उतने बेहतर होंगे।"],
  ["#saveIngredients", "मेरी रसोई सेव करें"],

  // Recipe Book
  ["#view-recipes h1", "रेसिपी बुक"],
  ['.chip[data-meal="all"]', "सभी"],
  ['.chip[data-meal="breakfast"]', "नाश्ता"],
  ['.chip[data-meal="lunch"]', "दोपहर का खाना"],
  ['.chip[data-meal="dinner"]', "रात का खाना"],

  // Plan for Tomorrow
  ["#view-planahead h1", "कल की योजना"],
  ["#view-planahead .section-sub", "कल के मेन्यू की एक झलक — ताकि आपको पता रहे कि आज रात, जब थोड़ी फुर्सत हो, क्या भिगोना, काटना या गूंधना है।"],
  ["#regenTomorrow", "कल का मेन्यू बदलें"],

  // About App
  ["#view-about-app h1", "ऐप के बारे में"],
  ["#view-about-app .prose p:nth-of-type(1)", "<strong>Kya Banaye</strong> एक छोटी लेकिन रोज़ की परेशानी सुलझाने के लिए बना है: दिन में तीन बार, हर दिन यह तय करना कि क्या पकाना है। यह हर उस व्यक्ति के लिए है जिस पर रसोई की ज़िम्मेदारी है — अक्सर भारतीय घरों की महिलाओं के लिए — जो बिना किसी श्रेय के यह अदृश्य सोच-विचार का काम रोज़ निभाती हैं।"],
  ["#view-about-app .prose p:nth-of-type(2)", "यह ऐप नाश्ते, दोपहर और रात के लिए सरल, सेहत का ध्यान रखने वाले, 100% शाकाहारी खाने सुझाता है, जो भारतीय रसोई में आमतौर पर मिलने वाली सामग्री से बनते हैं। साथ ही यह छोटी-छोटी पहले से की जाने वाली तैयारियों की याद भी दिलाता है — भिगोना, काटना, मैरिनेट करना, आटा गूंधना — ताकि कल का खाना आज से हल्का पड़े।"],
  ["#view-about-app .prose p:nth-of-type(3)", "यह आपसे कोई अनोखी चीज़ खरीदने, किसी डाइट ट्रेंड को अपनाने या कैलोरी गिनने को नहीं कहता। इसका मक़सद आपके दिन से एक फ़ैसला हटाना है, दस और जोड़ना नहीं।"],
  ["#view-about-app .prose h2", "यह क्या नहीं है"],
  ["#view-about-app .prose p:nth-of-type(4)", "यह कोई पोषण विशेषज्ञ, डॉक्टर या डायटीशियन नहीं है। यह आपका मेडिकल इतिहास, एलर्जी, शरीर की ज़रूरतें या आपके परिवार की विशेष आवश्यकताएँ नहीं जानता। कृपया इसके सुझावों पर भरोसा करने से पहले नीचे दिया गया नोट पढ़ें।"],
  ["#view-about-app .disclaimer-box h3", "सुझावों और उत्तरदायित्व पर एक सूचना"],
  ["#view-about-app .disclaimer-box p:nth-of-type(1)", "यह ऐप जो कुछ भी दिखाता है — खाने के विचार, स्वास्थ्य टैग, सामग्री के सुझाव और पहले से तैयारी की सलाह — वह केवल एक सामान्य सुझाव है, जो रोज़मर्रा के खाना पकाने के फ़ैसलों के लिए है। यह किसी भी प्रकार की चिकित्सकीय, आहार-संबंधी, पोषण-संबंधी या पेशेवर सलाह <em>नहीं</em> है, और आपकी विशिष्ट स्थिति के लिए किसी योग्य डायटीशियन या चिकित्सा पेशेवर द्वारा इसकी समीक्षा नहीं की गई है।"],
  ["#view-about-app .disclaimer-box p:nth-of-type(2)", "Kya Banaye और इसके डेवलपर <strong>Opal Luna Labs</strong> इस ऐप में दिखाए गए किसी भी सुझाव की सटीकता, पूर्णता, पोषण-संबंधी पर्याप्तता या उपयुक्तता के बारे में कोई वारंटी नहीं देते, और इस ऐप के उपयोग या इसकी सामग्री पर भरोसा करने से प्रत्यक्ष या अप्रत्यक्ष रूप से होने वाली किसी भी स्वास्थ्य समस्या, एलर्जी प्रतिक्रिया, खाद्य सुरक्षा परिणाम, आर्थिक हानि या किसी अन्य परिणाम के लिए कोई ज़िम्मेदारी या क़ानूनी दायित्व स्वीकार नहीं करते।"],
  ["#view-about-app .disclaimer-box p:nth-of-type(3)", "आप स्वयं ज़िम्मेदार हैं कि सामग्री को अपनी और अपने परिवार की एलर्जी, स्वास्थ्य स्थितियों और आहार-संबंधी पाबंदियों के अनुसार जाँचें, खाद्य-सुरक्षा के सुरक्षित तरीक़े अपनाएँ, और हर समय अपने विवेक का उपयोग करें। यदि आपको कोई विशेष स्वास्थ्य स्थिति है, तो अपने आहार में बदलाव करने से पहले कृपया किसी योग्य डॉक्टर या डायटीशियन से परामर्श लें।"],

  // About Us
  ["#view-about-us h1", "हमारे बारे में"],
  ["#view-about-us .prose p:nth-of-type(1)", "<strong>Opal Luna Labs</strong> छोटे, केंद्रित, रोज़मर्रा के काम आने वाले सॉफ़्टवेयर बनाता है — ऐसे जो बदले में ज़्यादा कुछ माँगे बिना चुपचाप किसी का थोड़ा समय या मानसिक मेहनत बचा दें। Kya Banaye ऐसा ही एक प्रोडक्ट है: उस फ़ैसले के इर्द-गिर्द बना, जो लाखों भारतीय घर चुपचाप दिन में तीन बार लेते हैं।"],
  ["#view-about-us .prose p:nth-of-type(2)", "हम आपकी रसोई का डेटा किसी सर्वर पर इकट्ठा करके आपको चीज़ें बेचने के लिए इस्तेमाल नहीं करते — “मेरी रसोई” में आप जो सेव करते हैं और आपकी रेसिपी का इतिहास आपके अपने डिवाइस पर ही रहता है। हम इस ऐप को मुफ़्त रखना चाहते हैं, जिसे कम दखल देने वाले विज्ञापनों और अतिरिक्त प्लानिंग फ़ीचर चाहने वालों के लिए एक वैकल्पिक प्रीमियम प्लान का सहारा मिलेगा; क्या मुफ़्त है और क्या नहीं, यह हम हमेशा साफ़ बताएँगे।"],
  ["#view-about-us .prose p:nth-of-type(3)", "कोई सुझाव है, कोई रेसिपी बतानी है, या कुछ ठीक से काम नहीं कर रहा? हम आपसे सुनना चाहेंगे।"],

  // Premium modal
  ["#premiumTitle", "Kya Banaye — प्रीमियम"],
  [".premium-list li:nth-child(1)", "एक टैप में पूरे 7 दिन का मेन्यू, एक-एक खाना चुनने की ज़रूरत नहीं"],
  [".premium-list li:nth-child(2)", "पूरे हफ़्ते की साझा करने और प्रिंट करने योग्य खरीदारी सूची"],
  [".premium-list li:nth-child(3)", "कोई विज्ञापन नहीं"],
  [".premium-list li:nth-child(4)", "परिवार प्रोफ़ाइल — अलग-अलग स्वाद और स्वास्थ्य ज़रूरतों के लिए अलग सुझाव"],
  [".premium-price", "जल्द आ रहा है"],
  ["#premiumNotify", "तैयार होते ही मुझे बताएँ"],

  // Footer (shown on every page)
  [".site-footer p:not(.footer-fine)", "&copy; <span id=\"year\"></span> Kya Banaye. सर्वाधिकार सुरक्षित। द्वारा संचालित एवं विकसित: <strong>Opal Luna Labs</strong>।"],
  [".footer-fine", "सभी सुझाव सामान्य जानकारी के रूप में हैं और पेशेवर चिकित्सा या आहार सलाह का विकल्प नहीं हैं। अपने विवेक का उपयोग करें। पूरी शर्तों के लिए <button class=\"link-btn\" data-route=\"about-app\">ऐप के बारे में</button> देखें।"],
];

const PLACEHOLDER_HI = { "#recipeSearch": "कोई व्यंजन या सामग्री खोजें…" };
const TITLE = {
  en: "Kya Banaye — Khane Mein Kya Banana Hai?",
  hi: "Kya Banaye — खाने में क्या बनाना है?",
};

/* ---------- Apply the chosen language to index.html's own text ---------- */
function applyStaticLang() {
  const hi = currentLang === "hi";

  STATIC_HI.forEach(([selector, hindi]) => {
    document.querySelectorAll(selector).forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;   // remember the English once
      el.innerHTML = hi ? hindi : el.dataset.en;
    });
  });

  Object.entries(PLACEHOLDER_HI).forEach(([selector, hindi]) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (el.dataset.enPh === undefined) el.dataset.enPh = el.getAttribute("placeholder") || "";
    el.setAttribute("placeholder", hi ? hindi : el.dataset.enPh);
  });

  document.documentElement.lang = hi ? "hi" : "en";
  document.title = TITLE[currentLang];

  const yearEl = document.getElementById("year");           // footer text was just rewritten
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const btn = document.getElementById("langToggle");
  if (btn) {
    btn.textContent = hi ? "EN" : "हिं";
    btn.setAttribute("aria-label", hi ? "Switch to English" : "हिंदी में देखें");
    btn.title = hi ? "Switch to English" : "हिंदी में देखें";
  }
}

function setLang(lang) {
  currentLang = lang === "hi" ? "hi" : "en";
  try { localStorage.setItem(LANG_STORAGE_KEY, currentLang); } catch (e) { /* ignore */ }
  applyStaticLang();
  if (typeof rerenderCurrent === "function") rerenderCurrent();   // defined in app.js
}
