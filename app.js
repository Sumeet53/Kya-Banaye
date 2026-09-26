const { createApp, ref, computed, onMounted } = Vue;

        createApp({
            setup() {
                // UI Core State
                const activeTab = ref('decide');
                const selectedMealType = ref('lunch');
                const selectedRegion = ref('All');
                const selectedDiet = ref('all'); // 'all' (Veg & Jain), 'veg' (Pure Veg), 'jain' (Strict Jain)
                const isSpinning = ref(false);
                const currentRandomDish = ref(null);
                const selectedRecipeForModal = ref(null);
                const toastMessage = ref(null);
                const isDarkMode = ref(false);
                const cookLog = ref({});   // { [recipeId]: 'YYYY-MM-DD' last cooked }
                const streak = ref({ count: 0, lastDate: null });
                const notifPermission = ref(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');

                // Household: who's eating today drives the diet filter automatically
                const household = ref([
                    { id: 1, name: 'Everyone', diet: 'veg' },
                    { id: 2, name: 'Jain member', diet: 'jain' },
                ]);
                const activeEaterIds = ref([1]);
                const newMemberName = ref('');
                const newMemberDiet = ref('veg');

                // Settings & Utilities
                const servingsCount = ref(2);
                const favoriteDishIds = ref([]);
                const searchQuery = ref('');
                const quickFilter = ref('all'); // all, favorites, jainOnly, under15, protein
                const checkedSteps = ref([]);
                const timerSeconds = ref(0);
                const timerRunning = ref(false);
                let timerInterval = null;
                const assumeStaples = ref(true);

                // Custom Recipe Modal State
                const showCustomRecipeModal = ref(false);
                const customRecipe = ref({
                    name: '',
                    mealType: 'lunch',
                    diet: 'jain',
                    ingredientsRaw: '',
                    description: ''
                });

                // Pantry State
                const selectedIngredients = ref([]);

                // Planner State
                const selectedDay = ref('Monday');
                const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const weeklyPlan = ref({});

                // Leftovers State
                const selectedLeftoverCategory = ref('roti');

                // Grocery Shopping List
                const newGroceryInput = ref('');
                const groceryItems = ref([]);

                // Nav Config
                const navigationTabs = [
                    { id: 'decide', label: 'Decide', icon: 'fa-solid fa-wand-magic-sparkles' },
                    { id: 'pantry', label: 'Pantry', icon: 'fa-solid fa-kitchen-set' },
                    { id: 'planner', label: 'Planner', icon: 'fa-solid fa-calendar-days' },
                    { id: 'leftovers', label: 'Leftover', icon: 'fa-solid fa-recycle' },
                    { id: 'grocery', label: 'Shopping', icon: 'fa-solid fa-basket-shopping' },
                ];

                const mealTypes = [
                    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
                    { id: 'lunch', label: 'Lunch', icon: '☀️' },
                    { id: 'snack', label: 'Snacks', icon: '☕' },
                    { id: 'dinner', label: 'Dinner', icon: '🌙' },
                ];

                const regions = ["All", "North Indian", "South Indian", "Gujarati & Rajasthani", "Malwa & Maharashtra", "Street Food", "Sweets & Desserts", "Quick 10-Min"];

                const allPantryIngredients = [
                    { id: 1, name: 'Paneer', emoji: '🧀', isRoot: false },
                    { id: 2, name: 'Tamatar (Tomato)', emoji: '🍅', isRoot: false },
                    { id: 3, name: 'Palak (Spinach)', emoji: '🥬', isRoot: false },
                    { id: 4, name: 'Aloo (Potato)', emoji: '🥔', isRoot: true },
                    { id: 5, name: 'Pyaz (Onion)', emoji: '🧅', isRoot: true },
                    { id: 6, name: 'Lahsun / Adrak', emoji: '🧄', isRoot: true },
                    { id: 7, name: 'Besan', emoji: '🌾', isRoot: false },
                    { id: 8, name: 'Poha', emoji: '🥣', isRoot: false },
                    { id: 9, name: 'Suji / Rava', emoji: '🍚', isRoot: false },
                    { id: 10, name: 'Toor Dal', emoji: '🫘', isRoot: false },
                    { id: 11, name: 'Moong Dal', emoji: '🥣', isRoot: false },
                    { id: 12, name: 'Rajma / Chana', emoji: '🍲', isRoot: false },
                    { id: 13, name: 'Kacha Kela (Raw Banana)', emoji: '🍌', isRoot: false },
                    { id: 14, name: 'Capsicum / Shimla Mirch', emoji: '🫑', isRoot: false },
                    { id: 15, name: 'Dahi (Curd)', emoji: '🥛', isRoot: false },
                    { id: 16, name: 'Matar (Green Peas)', emoji: '🫛', isRoot: false }
                ];

                const stapleIngredients = ['Oil', 'Ghee', 'Salt', 'Turmeric', 'Green Chili', 'Mustard Seeds', 'Atta', 'Rice', 'Hing (Asafoetida)', 'Jaggery/Sugar'];

                const recipes = ref([]);
                const loadError = ref(false);

                const leftoverTypes = [
                    { id: 'roti', label: 'Leftover Roti', icon: '🫓' },
                    { id: 'rice', label: 'Leftover Rice', icon: '🍚' },
                    { id: 'dal', label: 'Leftover Dal', icon: '🍲' }
                ];

                const leftoverRecipes = {
                    roti: [
                        {
                            title: 'Jain Desi Chapati Noodles',
                            time: '10 mins',
                            recipe: 'Cut leftover rotis into thin long strips. Sauté finely sliced capsicum and tomatoes on high heat in ghee. Toss roti strips with tomato ketchup and chili flakes.',
                            tip: 'Chilling rotis for 10 minutes makes them easy to slice evenly!'
                        },
                        {
                            title: 'Crispy Roti Cutlets (Jain)',
                            time: '12 mins',
                            recipe: 'Crumb 3 leftover rotis in a blender. Mix with boiled mashed raw banana, chopped tomatoes, chaat masala, and salt. Shape into tikkis and pan-fry till golden.',
                            tip: 'Add 1 tbsp besan if mixture feels moist.'
                        }
                    ],
                    rice: [
                        {
                            title: 'Tangy Lemon Rice',
                            time: '7 mins',
                            recipe: 'Heat ghee, crackle mustard seeds, peanuts, curry leaves, and turmeric. Turn off flame, toss in cold leftover rice, salt, and generous lemon juice.',
                            tip: 'Never cook lemon juice on flame to prevent bitterness.'
                        },
                        {
                            title: 'Jain Veg Fried Rice',
                            time: '8 mins',
                            recipe: 'Heat oil on high flame, toss finely diced capsicum, green peas, and sweetcorn. Add cold day-old rice, salt, black pepper, and 1 tbsp tomato sauce. Toss 3 mins.',
                            tip: 'Cold refrigerated rice yields perfect non-sticky grains.'
                        }
                    ],
                    dal: [
                        {
                            title: 'Soft Dal Parathas',
                            time: '15 mins',
                            recipe: 'Knead wheat flour (atta) directly using leftover thick yellow dal instead of water. Add ajwain, chopped green chilies, and salt. Roll and roast golden crispy parathas.',
                            tip: 'Produces super soft dough without adding curd or oil!'
                        },
                        {
                            title: 'Comforting Dal Dhokli',
                            time: '15 mins',
                            recipe: 'Dilute leftover dal with water and bring to boil with spices. Drop thin square strips of wheat dough into boiling dal and cook for 8 minutes till soft.',
                            tip: 'Garnish with a spoonful of ghee before serving.'
                        }
                    ]
                };

                const currentDietLabel = computed(() => {
                    if (selectedDiet.value === 'veg') return 'Pure Veg';
                    if (selectedDiet.value === 'jain') return 'Strict Jain';
                    return 'All (Veg & Jain)';
                });

                const dietBadgeColor = computed(() => {
                    if (selectedDiet.value === 'veg') return 'bg-purple-400';
                    if (selectedDiet.value === 'jain') return 'bg-pink-400';
                    return 'bg-indigo-300';
                });

                const filteredPantryIngredients = computed(() => {
                    if (selectedDiet.value === 'jain') {
                        return allPantryIngredients.filter(i => !i.isRoot);
                    }
                    return allPantryIngredients;
                });

                const filteredDishes = computed(() => {
                    return viewRecipes.value.filter(r => {
                        const matchesMeal = r.mealType === selectedMealType.value;
                        const matchesRegion = selectedRegion.value === 'All' || r.region === selectedRegion.value;
                        
                        let matchesDiet = true;
                        if (selectedDiet.value === 'jain') {
                            matchesDiet = r.diet === 'jain';
                        } else if (selectedDiet.value === 'veg') {
                            matchesDiet = r.diet === 'veg' || r.diet === 'jain';
                        }
                        
                        const q = searchQuery.value.trim().toLowerCase();
                        const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.toLowerCase().includes(q));

                        let matchesQuick = true;
                        if (quickFilter.value === 'favorites') matchesQuick = favoriteDishIds.value.includes(r.id);
                        if (quickFilter.value === 'jainOnly') matchesQuick = true;
                        if (quickFilter.value === 'under15') matchesQuick = r.prepTime <= 15;
                        if (quickFilter.value === 'protein') matchesQuick = r.tags && r.tags.includes('protein');

                        return matchesMeal && matchesRegion && matchesDiet && matchesSearch && matchesQuick;
                    });
                });

                const pantryMatchingDishes = computed(() => {
                    if (selectedIngredients.value.length === 0) return [];
                    
                    const userPool = assumeStaples.value ? [...selectedIngredients.value, ...stapleIngredients] : selectedIngredients.value;

                    return viewRecipes.value.filter(r => selectedDiet.value !== 'jain' || r.diet === 'jain')
                    .map(r => {
                        const matchCount = r.ingredients.filter(ing => 
                            userPool.some(s => ing.toLowerCase().includes(s.split(' ')[0].toLowerCase()))
                        ).length;
                        return { ...r, matchCount };
                    }).filter(r => r.matchCount > 0)
                      .sort((a, b) => b.matchCount - a.matchCount);
                });

                // Advance-prep hints: nudge the person the night/hours before, based on ingredients.
                const PREP_KEYWORDS = [
                    { match: ['rajma'], tip: 'Soak the rajma (kidney beans) for at least 6-8 hours or overnight.' },
                    { match: ['chickpeas'], tip: 'Soak the chickpeas overnight before pressure-cooking.' },
                    { match: ['black urad'], tip: 'Soak the urad dal for a few hours for a smoother, quicker cook.' },
                    { match: ['sabudana'], tip: 'Rinse and soak the sabudana for 4-6 hours (not more) so it turns soft, not mushy.' },
                    { match: ['paneer'], tip: 'If you have time, marinate the paneer in curd and spices 30 minutes ahead.' },
                    { match: ['moong dal'], tip: 'A quick 20-minute soak of the moong dal helps it cook faster.' },
                    { match: ['toor dal', 'chana dal', 'masoor dal'], tip: 'Rinse and soak the dal for 20-30 minutes for a faster, softer cook.' },
                ];
                const getPrepTip = (recipe) => {
                    if (!recipe) return null;
                    const ing = recipe.ingredients.join(' ').toLowerCase();
                    const hit = PREP_KEYWORDS.find(p => p.match.some(k => ing.includes(k)));
                    return hit ? hit.tip : null;
                };

                const todayStr = () => new Date().toISOString().slice(0, 10);

                const isRecentlyCooked = (recipeId) => {
                    const last = cookLog.value[recipeId];
                    if (!last) return false;
                    const days = (Date.now() - new Date(last).getTime()) / 86400000;
                    return days < 5;
                };

                const markCooked = (recipe) => {
                    if (!recipe) return;
                    const today = todayStr();
                    cookLog.value = { ...cookLog.value, [recipe.id]: today };
                    localStorage.setItem('akb_cook_log', JSON.stringify(cookLog.value));

                    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
                    if (streak.value.lastDate === today) {
                        // already logged today, streak unchanged
                    } else if (streak.value.lastDate === y) {
                        streak.value = { count: streak.value.count + 1, lastDate: today };
                    } else {
                        streak.value = { count: 1, lastDate: today };
                    }
                    localStorage.setItem('akb_streak', JSON.stringify(streak.value));
                    showToast(`✅ Marked cooked! 🔥 ${streak.value.count}-day streak`);
                };

                // What's next: greeting + next meal + a pick for it + any advance-prep nudge.
                // The pick rotates daily (by date, not randomly) so it's stable within a day.
                const mealClock = computed(() => {
                    const hr = new Date().getHours();
                    let greeting, nextMeal, nextLabel;
                    if (hr < 6)       { greeting = 'Late night';      nextMeal = 'breakfast'; nextLabel = "Tomorrow's Breakfast"; }
                    else if (hr < 10) { greeting = 'Good morning';    nextMeal = 'breakfast'; nextLabel = 'Breakfast'; }
                    else if (hr < 15) { greeting = 'Good afternoon';  nextMeal = 'lunch';      nextLabel = 'Lunch'; }
                    else if (hr < 19) { greeting = 'Good evening';    nextMeal = 'dinner';     nextLabel = 'Dinner'; }
                    else if (hr < 22) { greeting = 'Good evening';    nextMeal = 'dinner';     nextLabel = 'Dinner'; }
                    else              { greeting = 'Good night';     nextMeal = 'breakfast'; nextLabel = "Tomorrow's Breakfast"; }

                    const all = recipes.value.filter(r => r.mealType === nextMeal);
                    const fresh = all.filter(r => !isRecentlyCooked(r.id));
                    const pool = fresh.length ? fresh : all; // if everything was cooked recently, just show something
                    const dayIndex = Math.floor(Date.now() / 86400000);
                    const pick = pool.length ? pool[dayIndex % pool.length] : null;
                    return { greeting, nextMeal, nextLabel, pick, prepTip: getPrepTip(pick) };
                });

                // ---------- Meal-time & prep-ahead notifications (best-effort, see note below) ----------
                // These fire reliably whenever the app is open or freshly reopened. On Android/Chrome,
                // installed as a home-screen app, they can also fire in the background via Periodic
                // Background Sync -- but that's a browser-granted, best-effort feature (not guaranteed,
                // and not available on iOS at all). Guaranteed "app fully closed" reminders on every
                // phone need a real push server, which a static GitHub Pages site can't provide alone.
                const MEAL_WINDOWS = [
                    { key: 'breakfast', hour: 8,  minute: 0,  mealType: 'breakfast', label: 'Breakfast' },
                    { key: 'lunch',     hour: 13, minute: 0,  mealType: 'lunch',     label: 'Lunch' },
                    { key: 'snacks',    hour: 16, minute: 30, mealType: 'snack',     label: 'Snacks' },
                    { key: 'dinner',    hour: 20, minute: 0,  mealType: 'dinner',    label: 'Dinner' },
                ];
                const PREP_LEAD_MINUTES = 90;

                const pickForMealType = (mealType, dayOffset = 0) => {
                    const pool = recipes.value.filter(r => r.mealType === mealType);
                    const fresh = pool.filter(r => !isRecentlyCooked(r.id));
                    const usable = fresh.length ? fresh : pool;
                    const dayIndex = Math.floor(Date.now() / 86400000) + dayOffset;
                    return usable.length ? usable[dayIndex % usable.length] : null;
                };

                const showLocalNotification = (title, body) => {
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then(reg =>
                            reg.showNotification(title, { body, icon: 'icon-192.png', badge: 'icon-192.png' })
                        ).catch(() => { try { new Notification(title, { body }); } catch (e) {} });
                    } else {
                        try { new Notification(title, { body }); } catch (e) {}
                    }
                };

                const checkMealNotifications = () => {
                    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
                    if (!recipes.value.length) return;

                    const now = new Date();
                    const seenKey = 'akb_notified_' + todayStr();
                    let seen = {};
                    try { seen = JSON.parse(localStorage.getItem(seenKey) || '{}'); } catch (e) {}
                    let changed = false;

                    MEAL_WINDOWS.forEach(w => {
                        const windowStart = new Date(now);
                        windowStart.setHours(w.hour, w.minute, 0, 0);
                        const sinceStart = (now - windowStart) / 60000;

                        // Suggestion right at meal time (a 15-min catch-up window covers the interval gap)
                        if (sinceStart >= 0 && sinceStart <= 15 && !seen[w.key + '_suggest']) {
                            const pick = pickForMealType(w.mealType);
                            if (pick) showLocalNotification(w.label + ' time! 🍽️', `How about ${pick.name}?`);
                            seen[w.key + '_suggest'] = true; changed = true;
                        }

                        // Advance-prep nudge before that meal, same day
                        const prepAt = new Date(windowStart.getTime() - PREP_LEAD_MINUTES * 60000);
                        const sincePrep = (now - prepAt) / 60000;
                        if (sincePrep >= 0 && sincePrep <= 15 && !seen[w.key + '_prep']) {
                            const tip = getPrepTip(pickForMealType(w.mealType));
                            if (tip) showLocalNotification('Prep for ' + w.label + ' 🕒', tip);
                            seen[w.key + '_prep'] = true; changed = true;
                        }
                    });

                    // Night-before nudge for tomorrow's breakfast (soaking poha, batter, etc.)
                    const nightPrep = new Date(now); nightPrep.setHours(21, 30, 0, 0);
                    const sinceNight = (now - nightPrep) / 60000;
                    if (sinceNight >= 0 && sinceNight <= 15 && !seen.tomorrow_breakfast_prep) {
                        const tip = getPrepTip(pickForMealType('breakfast', 1));
                        if (tip) showLocalNotification("Tonight: prep for tomorrow's breakfast 🌙", tip);
                        seen.tomorrow_breakfast_prep = true; changed = true;
                    }

                    if (changed) localStorage.setItem(seenKey, JSON.stringify(seen));
                };

                const enableNotifications = async () => {
                    if (typeof Notification === 'undefined') {
                        showToast('Notifications are not supported on this browser.');
                        return;
                    }
                    const perm = await Notification.requestPermission();
                    notifPermission.value = perm;
                    if (perm !== 'granted') { showToast('Notifications were not enabled.'); return; }

                    showToast('🔔 Meal reminders enabled!');
                    checkMealNotifications();

                    // Best-effort only: Periodic Background Sync (Chrome/Android, installed app, not on iOS)
                    try {
                        const reg = await navigator.serviceWorker.ready;
                        if ('periodicSync' in reg) {
                            const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
                            if (status.state === 'granted') {
                                await reg.periodicSync.register('meal-check', { minInterval: 60 * 60 * 1000 });
                            }
                        }
                    } catch (e) { /* not supported here -- the in-app scheduler above still covers this device */ }
                };

                const jainView = (r) => {
                    if (r.diet === 'jain') return r;
                    if (!r.jain) return null;
                    const omit = (r.jain.omit || []).map(s => s.toLowerCase());
                    const keep = r.ingredients.filter(i => !omit.includes(i.toLowerCase()));
                    const add = (r.jain.add || []).filter(a => !keep.includes(a));
                    return { ...r, diet: 'jain', jainAdapted: true, ingredients: [...keep, ...add], steps: [...r.steps, '🌱 Jain version: ' + r.jain.note] };
                };
                const viewRecipes = computed(() => {
                    const jainMode = selectedDiet.value === 'jain' || quickFilter.value === 'jainOnly';
                    return jainMode ? recipes.value.map(jainView).filter(Boolean) : recipes.value;
                });
                const recipeCount = computed(() => recipes.value.length);
                const currentLeftovers = computed(() => leftoverRecipes[selectedLeftoverCategory.value] || []);

                const showToast = (msg) => {
                    toastMessage.value = msg;
                    setTimeout(() => { toastMessage.value = null; }, 2500);
                };

                const toggleDarkMode = () => {
                    isDarkMode.value = !isDarkMode.value;
                    if (isDarkMode.value) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                };



                const changeServings = (delta) => {
                    if (servingsCount.value + delta >= 1 && servingsCount.value + delta <= 12) {
                        servingsCount.value += delta;
                        showToast(`Portions updated for ${servingsCount.value} ${servingsCount.value === 1 ? 'person' : 'people'}`);
                    }
                };

                const isFavorite = (id) => favoriteDishIds.value.includes(id);
                const toggleFavorite = (id) => {
                    const idx = favoriteDishIds.value.indexOf(id);
                    if (idx > -1) {
                        favoriteDishIds.value.splice(idx, 1);
                        showToast('Removed from Favorites');
                    } else {
                        favoriteDishIds.value.push(id);
                        showToast('Saved to Favorites ❤️');
                    }
                    localStorage.setItem('akb_favorites', JSON.stringify(favoriteDishIds.value));
                };

                const startTimer = (seconds) => {
                    if (timerInterval) clearInterval(timerInterval);
                    timerSeconds.value = seconds;
                    timerRunning.value = true;
                    timerInterval = setInterval(() => {
                        if (timerSeconds.value > 0) {
                            timerSeconds.value--;
                        } else {
                            stopTimer();
                            showToast('⏰ Kitchen Timer Complete!');
                        }
                    }, 1000);
                };

                const stopTimer = () => {
                    timerRunning.value = false;
                    if (timerInterval) clearInterval(timerInterval);
                };

                const resetTimer = () => {
                    stopTimer();
                    timerSeconds.value = 0;
                };

                const formatTimer = (totalSec) => {
                    const mins = Math.floor(totalSec / 60);
                    const secs = totalSec % 60;
                    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                };

                const toggleStepCheck = (idx) => {
                    const found = checkedSteps.value.indexOf(idx);
                    if (found > -1) checkedSteps.value.splice(found, 1);
                    else checkedSteps.value.push(idx);
                };
                const isStepChecked = (idx) => checkedSteps.value.includes(idx);

                const applyHouseholdDiet = () => {
                    const eating = household.value.filter(p => activeEaterIds.value.includes(p.id));
                    if (!eating.length) { selectedDiet.value = 'all'; return; }
                    selectedDiet.value = eating.some(p => p.diet === 'jain') ? 'jain' : 'veg';
                };

                const toggleEater = (id) => {
                    const i = activeEaterIds.value.indexOf(id);
                    if (i > -1) activeEaterIds.value.splice(i, 1);
                    else activeEaterIds.value.push(id);
                    localStorage.setItem('akb_active_eaters', JSON.stringify(activeEaterIds.value));
                    applyHouseholdDiet();
                };

                const addHouseholdMember = () => {
                    const name = newMemberName.value.trim();
                    if (!name) return;
                    const id = Date.now();
                    household.value = [...household.value, { id, name, diet: newMemberDiet.value }];
                    activeEaterIds.value = [...activeEaterIds.value, id];
                    newMemberName.value = '';
                    localStorage.setItem('akb_household', JSON.stringify(household.value));
                    localStorage.setItem('akb_active_eaters', JSON.stringify(activeEaterIds.value));
                    applyHouseholdDiet();
                };

                const removeHouseholdMember = (id) => {
                    if (household.value.length <= 1) { showToast("Keep at least one person."); return; }
                    household.value = household.value.filter(p => p.id !== id);
                    activeEaterIds.value = activeEaterIds.value.filter(x => x !== id);
                    localStorage.setItem('akb_household', JSON.stringify(household.value));
                    localStorage.setItem('akb_active_eaters', JSON.stringify(activeEaterIds.value));
                    applyHouseholdDiet();
                };

                const recentLeftoverNudge = computed(() => {
                    const entries = Object.entries(cookLog.value);
                    if (!entries.length || !recipes.value.length) return null;
                    // most recent cook within the last 2 days
                    const recent = entries
                        .filter(([, date]) => (Date.now() - new Date(date).getTime()) / 86400000 <= 2)
                        .sort((a, b) => new Date(b[1]) - new Date(a[1]))[0];
                    if (!recent) return null;
                    const dish = recipes.value.find(r => String(r.id) === String(recent[0]));
                    if (!dish) return null;
                    const ing = dish.ingredients.join(' ').toLowerCase();
                    let category = null;
                    if (/rice|pulao|biryani|khichdi/.test(dish.name.toLowerCase()) || ing.includes('rice')) category = 'rice';
                    else if (/roti|paratha|thepla|naan|poori|bhakri/.test(dish.name.toLowerCase())) category = 'roti';
                    else if (/dal|sambar|kadhi/.test(dish.name.toLowerCase())) category = 'dal';
                    if (!category) return null;
                    return { dishName: dish.name, category };
                });

                const cycleDietPreference = () => {
                    const modes = ['all', 'veg', 'jain'];
                    const nextIndex = (modes.indexOf(selectedDiet.value) + 1) % modes.length;
                    selectedDiet.value = modes[nextIndex];
                    showToast(`Diet mode: ${currentDietLabel.value}`);
                };

                const getMealTypeLabel = (id) => {
                    const found = mealTypes.find(m => m.id === id);
                    return found ? found.label : id;
                };

                const spinForMeal = () => {
                    const pool = filteredDishes.value;
                    if (pool.length === 0) {
                        showToast('No dishes match your active filter!');
                        return;
                    }
                    isSpinning.value = true;
                    setTimeout(() => {
                        const random = pool[Math.floor(Math.random() * pool.length)];
                        currentRandomDish.value = random;
                        isSpinning.value = false;
                    }, 350);
                };

                const openCustomRecipeModal = () => {
                    customRecipe.value = {
                        name: '',
                        mealType: selectedMealType.value,
                        diet: selectedDiet.value === 'jain' ? 'jain' : 'veg',
                        ingredientsRaw: '',
                        description: ''
                    };
                    showCustomRecipeModal.value = true;
                };

                const saveCustomRecipe = () => {
                    if (!customRecipe.value.name.trim()) {
                        showToast('Please enter a recipe name');
                        return;
                    }
                    const ingList = customRecipe.value.ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean);
                    const newDish = {
                        id: Date.now(),
                        name: customRecipe.value.name,
                        emoji: '🍲',
                        mealType: customRecipe.value.mealType,
                        prepTime: 15,
                        region: 'Custom',
                        diet: customRecipe.value.diet,
                        ingredients: ingList.length > 0 ? ingList : ['Spices', 'Love'],
                        description: customRecipe.value.description || 'Custom homemade family favorite recipe.',
                        steps: ['Prepare ingredients.', 'Cook according to family recipe traditions.', 'Serve hot!']
                    };

                    recipes.value.unshift(newDish);
                    showCustomRecipeModal.value = false;
                    showToast('Custom recipe saved to your book! ✨');
                };

                const toggleIngredient = (name) => {
                    const idx = selectedIngredients.value.indexOf(name);
                    if (idx > -1) selectedIngredients.value.splice(idx, 1);
                    else selectedIngredients.value.push(name);
                };

                const openRecipeModal = (recipe) => {
                    selectedRecipeForModal.value = recipe;
                    checkedSteps.value = [];
                    resetTimer();
                };

                const randomizeSlot = (day, slot) => {
                    const slotPool = viewRecipes.value.filter(r => r.mealType === slot && (selectedDiet.value !== 'jain' || r.diet === 'jain'));
                    if (slotPool.length > 0) {
                        const random = slotPool[Math.floor(Math.random() * slotPool.length)];
                        if (!weeklyPlan.value[day]) weeklyPlan.value[day] = {};
                        weeklyPlan.value[day][slot] = random;
                        savePlanToLocalStorage();
                    }
                };

                const autoGenerateWeeklyPlan = () => {
                    weekDays.forEach(day => {
                        weeklyPlan.value[day] = {};
                        ['breakfast', 'lunch', 'snack', 'dinner'].forEach(slot => {
                            const pool = viewRecipes.value.filter(r => r.mealType === slot && (selectedDiet.value !== 'jain' || r.diet === 'jain'));
                            if (pool.length > 0) {
                                weeklyPlan.value[day][slot] = pool[Math.floor(Math.random() * pool.length)];
                            }
                        });
                    });
                    savePlanToLocalStorage();
                    showToast('7-Day Meal Plan Generated!');
                };

                const shareWeeklyPlan = () => {
                    let text = `📅 *My Weekly Meal Plan (${servingsCount.value} ${servingsCount.value === 1 ? 'person' : 'people'})*\n\n`;
                    weekDays.forEach(day => {
                        text += `*${day}:*\n`;
                        if (weeklyPlan.value[day]) {
                            text += `  🌅 ${weeklyPlan.value[day].breakfast?.name || '---'}\n`;
                            text += `  ☀️ ${weeklyPlan.value[day].lunch?.name || '---'}\n`;
                            text += `  ☕ ${weeklyPlan.value[day].snack?.name || '---'}\n`;
                            text += `  🌙 ${weeklyPlan.value[day].dinner?.name || '---'}\n`;
                        }
                    });
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                };

                const generateGroceryListFromPlan = () => {
                    const itemsSet = new Set();
                    Object.values(weeklyPlan.value).forEach(day => {
                        Object.values(day).forEach(dish => {
                            if (dish && dish.ingredients) {
                                dish.ingredients.forEach(ing => itemsSet.add(`${ing} (${servingsCount.value} portions)`));
                            }
                        });
                    });

                    if (itemsSet.size === 0) {
                        showToast('Please set your meal plan first!');
                        return;
                    }

                    itemsSet.forEach(ing => {
                        if (!groceryItems.value.some(g => g.name === ing)) {
                            groceryItems.value.push({ id: Date.now() + Math.random(), name: ing, checked: false });
                        }
                    });
                    saveGroceryToLocalStorage();
                    activeTab.value = 'grocery';
                    showToast('Shopping list generated from Plan!');
                };

                const addCustomGroceryItem = () => {
                    if (!newGroceryInput.value.trim()) return;
                    groceryItems.value.push({
                        id: Date.now(),
                        name: newGroceryInput.value.trim(),
                        checked: false
                    });
                    newGroceryInput.value = '';
                    saveGroceryToLocalStorage();
                };

                const removeGroceryItem = (id) => {
                    groceryItems.value = groceryItems.value.filter(i => i.id !== id);
                    saveGroceryToLocalStorage();
                };

                const clearCheckedGrocery = () => {
                    groceryItems.value = groceryItems.value.filter(i => !i.checked);
                    saveGroceryToLocalStorage();
                };

                const clearAllGrocery = () => {
                    groceryItems.value = [];
                    saveGroceryToLocalStorage();
                };

                const addRecipeToGrocery = (recipe) => {
                    recipe.ingredients.forEach(ing => {
                        const formattedName = `${ing} (${servingsCount.value} portions)`;
                        if (!groceryItems.value.some(g => g.name === formattedName)) {
                            groceryItems.value.push({ id: Date.now() + Math.random(), name: formattedName, checked: false });
                        }
                    });
                    saveGroceryToLocalStorage();
                    showToast('Ingredients added to Shopping List!');
                    selectedRecipeForModal.value = null;
                };

                const shareOnWhatsApp = () => {
                    if (groceryItems.value.length === 0) {
                        showToast('Shopping list is empty!');
                        return;
                    }
                    const text = "🛒 *Kya Banaye - Rashan Shopping List*\n\n" + 
                                groceryItems.value.map(i => `${i.checked ? '✅' : '📌'} ${i.name}`).join('\n');
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                };

                const savePlanToLocalStorage = () => {
                    localStorage.setItem('akb_weekly_plan', JSON.stringify(weeklyPlan.value));
                };

                const saveGroceryToLocalStorage = () => {
                    localStorage.setItem('akb_grocery_items', JSON.stringify(groceryItems.value));
                };

                onMounted(async () => {
                    try {
                        if (window.KYA_BANAYE_RECIPES) {
                            recipes.value = window.KYA_BANAYE_RECIPES.recipes || window.KYA_BANAYE_RECIPES;
                        } else {
                            const res = await fetch('recipes.json');
                            if (!res.ok) throw new Error(res.status);
                            const data = await res.json();
                            recipes.value = data.recipes || data;
                        }
                    } catch (e) { loadError.value = true; }

                    const savedHousehold = localStorage.getItem('akb_household');
                    if (savedHousehold) { try { household.value = JSON.parse(savedHousehold); } catch (e) {} }
                    const savedEaters = localStorage.getItem('akb_active_eaters');
                    if (savedEaters) { try { activeEaterIds.value = JSON.parse(savedEaters); } catch (e) {} }
                    applyHouseholdDiet();

                    const savedCookLog = localStorage.getItem('akb_cook_log');
                    if (savedCookLog) { try { cookLog.value = JSON.parse(savedCookLog); } catch(e){} }
                    const savedStreak = localStorage.getItem('akb_streak');
                    if (savedStreak) { try { streak.value = JSON.parse(savedStreak); } catch(e){} }

                    const savedFavs = localStorage.getItem('akb_favorites');
                    if (savedFavs) {
                        try { favoriteDishIds.value = JSON.parse(savedFavs); } catch(e){}
                    }

                    const savedPlan = localStorage.getItem('akb_weekly_plan');
                    if (savedPlan) {
                        try { weeklyPlan.value = JSON.parse(savedPlan); } catch(e){}
                    } else {
                        autoGenerateWeeklyPlan();
                    }

                    const savedGrocery = localStorage.getItem('akb_grocery_items');
                    if (savedGrocery) {
                        try { groceryItems.value = JSON.parse(savedGrocery); } catch(e){}
                    }

                    spinForMeal();

                    checkMealNotifications();
                    setInterval(checkMealNotifications, 5 * 60 * 1000);
                });

                return {
                    activeTab,
                    loadError,
                    recipeCount,
                    mealClock,
                    streak,
                    markCooked,
                    notifPermission,
                    enableNotifications,
                    household,
                    activeEaterIds,
                    newMemberName,
                    newMemberDiet,
                    toggleEater,
                    addHouseholdMember,
                    removeHouseholdMember,
                    recentLeftoverNudge,
                    selectedMealType,
                    selectedRegion,
                    selectedDiet,
                    isSpinning,
                    currentRandomDish,
                    selectedRecipeForModal,
                    selectedIngredients,
                    selectedDay,
                    weekDays,
                    weeklyPlan,
                    selectedLeftoverCategory,
                    newGroceryInput,
                    groceryItems,
                    toastMessage,
                    isDarkMode,
                    servingsCount,
                    favoriteDishIds,
                    searchQuery,
                    quickFilter,
                    checkedSteps,
                    timerSeconds,
                    timerRunning,
                    assumeStaples,
                    showCustomRecipeModal,
                    customRecipe,
                    navigationTabs,
                    mealTypes,
                    regions,
                    allPantryIngredients,
                    filteredPantryIngredients,
                    leftoverTypes,
                    currentDietLabel,
                    dietBadgeColor,
                    filteredDishes,
                    pantryMatchingDishes,
                    currentLeftovers,
                    toggleDarkMode,
                    changeServings,
                    isFavorite,
                    toggleFavorite,
                    startTimer,
                    stopTimer,
                    resetTimer,
                    formatTimer,
                    toggleStepCheck,
                    isStepChecked,
                    cycleDietPreference,
                    getMealTypeLabel,
                    spinForMeal,
                    openCustomRecipeModal,
                    saveCustomRecipe,
                    toggleIngredient,
                    openRecipeModal,
                    randomizeSlot,
                    autoGenerateWeeklyPlan,
                    shareWeeklyPlan,
                    generateGroceryListFromPlan,
                    addCustomGroceryItem,
                    removeGroceryItem,
                    clearCheckedGrocery,
                    clearAllGrocery,
                    addRecipeToGrocery,
                    shareOnWhatsApp,
                    saveGroceryToLocalStorage
                };
            }
        }).mount('#app');

        // Reveal the app now that Vue has mounted; hide the plain-HTML boot splash.
        document.getElementById('app').classList.add('kb-ready');
        var splash = document.getElementById('boot-splash');
        if (splash) splash.remove();

// Offline support (works when served over http/https)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
