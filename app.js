const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const recipes = ref([]);
    const isLoading = ref(true);
    const dataSource = ref('Initializing...');

    // REPLACE THIS URL with your hosted recipes.json link
    // Examples: 'https://raw.githubusercontent.com/username/repo/main/recipes.json'
    // Or local testing: './recipes.json'
    const LIVE_JSON_URL = './recipes.json';

    // Hardcoded safety net if network and cache both fail on first run
    const fallbackRecipes = [
      {
        id: 0,
        name: "Offline Default Recipe",
        category: "General",
        isJain: true,
        prepTime: "5 mins",
        calories: 150,
        servings: 1,
        description: "Standard fallback recipe stored locally in the JS application build.",
        ingredients: ["1 Cup Water", "1 Teabag", "Sugar to taste"],
        instructions: ["Boil water.", "Add teabag.", "Serve hot."]
      }
    ];

    const fetchRecipes = async () => {
      isLoading.value = true;

      try {
        // 1. Try fetching live recipes over network
        const response = await fetch(`${LIVE_JSON_URL}?cacheBuster=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to reach server');

        const data = await response.json();
        recipes.value = data;
        dataSource.value = 'Live Server (Updated)';

        // 2. Save fresh copy to phone storage for offline usage
        localStorage.setItem('app_cached_recipes', JSON.stringify(data));

      } catch (error) {
        console.warn('Network issue or server unavailable. Trying local cache...', error);

        // 3. Fallback to phone storage
        const cachedData = localStorage.getItem('app_cached_recipes');

        if (cachedData) {
          recipes.value = JSON.parse(cachedData);
          dataSource.value = 'Offline Device Cache';
        } else {
          // 4. Fallback to hardcoded array if first launch was offline
          recipes.value = fallbackRecipes;
          dataSource.value = 'Built-in App Fallback';
        }
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchRecipes();
    });

    return {
      recipes,
      isLoading,
      dataSource,
      fetchRecipes
    };
  }
}).mount('#app');   