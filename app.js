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
                        const res = await fetch('recipes.json');
                        if (!res.ok) throw new Error(res.status);
                        const data = await res.json();
                        recipes.value = data.recipes || data;
                    } catch (e) { loadError.value = true; }

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
                });

                return {
                    activeTab,
                    loadError,
                    recipeCount,
                    mealClock,
                    streak,
                    markCooked,
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
