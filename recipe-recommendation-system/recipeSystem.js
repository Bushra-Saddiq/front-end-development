
console.log("==================================");
console.log("   RECIPE RECOMMENDATION SYSTEM");
console.log("==================================");

// 1. Create the search queue
const searchQueue = [
    "pasta",
    "pizza",
    "chicken",
    "sushi",
    "dessert",
    "",
    123,
    "pasta",
    "   pizza   "
];

console.log("\nSearch queue created:");
console.log(searchQueue);
console.log(`Total search entries: ${searchQueue.length}`);


// 2. Create arrays for valid searches and event logs
const validSearches = [];
const eventLog = [];

// 3. Track searches that have already been processed
const processedSearches = new Set();

// 4. Validate every search
searchQueue.forEach((search, index) => {

    // Check whether the search is a string
    if (typeof search !== "string") {
        const message = `Search #${index + 1} skipped: search term must be a non-empty string`;

        console.log(`⚠ ${message}`);
        eventLog.push(message);
        return;
    }

    // Remove unnecessary spaces
    const cleanSearch = search.trim();

    // Check whether the search is empty
    if (cleanSearch === "") {
        const message = `Search #${index + 1} skipped: search term must not be empty`;

        console.log(`⚠ ${message}`);
        eventLog.push(message);
        return;
    }

    // Check for duplicate searches
    if (processedSearches.has(cleanSearch.toLowerCase())) {
        const message = `Duplicate search skipped: "${cleanSearch}"`;

        console.log(`⚠ ${message}`);
        eventLog.push(message);
        return;
    }

    // Save the unique, valid search
    processedSearches.add(cleanSearch.toLowerCase());
    validSearches.push(cleanSearch);

    const message = `Valid search added: "${cleanSearch}"`;

    console.log(`✓ ${message}`);
    eventLog.push(message);
});

console.log("\n========== VALIDATION RESULTS ==========");
console.log("Valid searches:", validSearches);
console.log("Total valid searches:", validSearches.length);
console.log("Event log:", eventLog);


// ==========================================
// 5. API HANDLER
// ==========================================

// Store all recipes received from the API
const allRecipes = [];
const searchResults = [];

// Store search statistics
const statistics = {
    successfulSearches: 0,
    failedSearches: 0,
    recipesReceived: 0
};

// Create an asynchronous function
async function fetchRecipes() {

    // Process each valid search
    for (const search of validSearches) {

        console.log(`\n🔎 Searching recipes for: ${search}...`);

        try {

            // Send request to DummyJSON API
            const response = await fetch(
                `https://dummyjson.com/recipes/search?q=${encodeURIComponent(search)}`
            );

            // Check whether the API request was successful
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // Convert response into JavaScript data
            const data = await response.json();

            // Get recipes from the response
            const recipes = data.recipes || [];

            // Check whether recipes were found
            if (recipes.length === 0) {

                statistics.failedSearches++;

                const message = `Search "${search}" failed: no recipes found`;

                console.log(`⚠ ${message}`);
                eventLog.push(message);

                const noSuitableMessage =
                    `No suitable recipes found for "${search}"`;

                console.log(`⚠ ${noSuitableMessage}`);
                eventLog.push(noSuitableMessage);

                continue;
            }

            // Save the received recipes
            allRecipes.push(...recipes);

            // Keep track of which recipes belong to each search
            searchResults.push({
                search,
                recipes
            });

            statistics.successfulSearches++;
            statistics.recipesReceived += recipes.length;

            // Display the number of recipes received
            const receivedMessage =
                `Received ${recipes.length} recipes for "${search}"`;

            console.log(`✓ ${receivedMessage}`);
            eventLog.push(receivedMessage);

            // Count recipes that satisfy recommendation rules
            const suitableCount = recipes.filter(
                (recipe) => isSuitableRecipe(recipe)
            ).length;

            // Display suitable recipe count immediately
            if (suitableCount > 0) {

                const suitableMessage =
                    `Found ${suitableCount} suitable recipes for "${search}"`;

                console.log(`✓ ${suitableMessage}`);
                eventLog.push(suitableMessage);

            } else {

                const noSuitableMessage =
                    `No suitable recipes found for "${search}"`;

                console.log(`⚠ ${noSuitableMessage}`);
                eventLog.push(noSuitableMessage);
            }

        } catch (error) {

            statistics.failedSearches++;

            const message =
                `Search "${search}" failed: ${error.message}`;

            console.log(`⚠ ${message}`);
            eventLog.push(message);

        }
    }

    // Display API statistics
    console.log("\n========== API RESULTS ==========");
    console.log("Successful searches:", statistics.successfulSearches);
    console.log("Failed searches:", statistics.failedSearches);
    console.log("Recipes received:", statistics.recipesReceived);
    console.log("Total recipe objects:", allRecipes.length);
}



// ==========================================
// 6. RECOMMENDATION ENGINE
// ==========================================

const validRecipes = [];
const rejectedRecipes = [];
const recommendedRecipes = [];

const seenRecipeIds = new Set();

// Validate important recipe information
function validateRecipe(recipe) {

    const {
        id,
        name,
        rating,
        difficulty,
        cuisine,
        prepTimeMinutes
    } = recipe;

    return (
        Number.isInteger(id) &&
        id > 0 &&
        typeof name === "string" &&
        name.trim() !== "" &&
        typeof rating === "number" &&
        Number.isFinite(rating) &&
        rating >= 0 &&
        rating <= 5 &&
        typeof difficulty === "string" &&
        ["easy", "medium", "hard"].includes(
            difficulty.trim().toLowerCase()
        ) &&
        typeof cuisine === "string" &&
        cuisine.trim() !== "" &&
        typeof prepTimeMinutes === "number" &&
        Number.isFinite(prepTimeMinutes) &&
        prepTimeMinutes >= 0
    );
}

// Check whether a recipe meets recommendation rules
function isSuitableRecipe(recipe) {

    return (
        validateRecipe(recipe) &&
        recipe.rating >= 4.0 &&
        recipe.prepTimeMinutes <= 60 &&
        recipe.difficulty.toLowerCase() !== "hard"
    );
}

// Process every recipe received
function runRecommendationEngine() {

    console.log("\n========== RECOMMENDATION ENGINE ==========");

    // Step 1: Validate all recipes
    allRecipes.forEach((recipe) => {

        if (!validateRecipe(recipe)) {

            rejectedRecipes.push({
                recipe: recipe.name || "Unknown recipe",
                reason: "Missing or invalid information"
            });

            eventLog.push(
                `Recipe rejected: ${recipe.name || "Unknown recipe"} - invalid data`
            );

            return;
        }

        validRecipes.push(recipe);
    });

    console.log("Valid recipes:", validRecipes.length);

    // Step 2: Apply recommendation rules
    const suitableRecipes = validRecipes.filter((recipe) => {

        const suitable = isSuitableRecipe(recipe);

        if (!suitable) {

            rejectedRecipes.push({
                recipe: recipe.name,
                reason: "Did not meet recommendation rules"
            });

            eventLog.push(
                `Recipe rejected: ${recipe.name} - unsuitable`
            );
        }

        return suitable;
    });

    // Step 3: Calculate recommendation scores
    const scoredRecipes = suitableRecipes.map((recipe) => {

        const {
            rating,
            difficulty,
            prepTimeMinutes
        } = recipe;

        const ratingScore = (rating / 5) * 50;

        const timeScore =
            ((60 - prepTimeMinutes) / 60) * 30;

        const difficultyScore =
            difficulty.toLowerCase() === "easy" ? 20 : 10;

        const score = Math.round(
            ratingScore + timeScore + difficultyScore
        );

        return {
            ...recipe,
            score
        };
    });

    // Step 4: Remove duplicate recipes using recipe ID
    scoredRecipes.forEach((recipe) => {

        if (seenRecipeIds.has(recipe.id)) {

            eventLog.push(
                `Duplicate recipe removed: ${recipe.name}`
            );

            return;
        }

        seenRecipeIds.add(recipe.id);
        recommendedRecipes.push(recipe);
    });

    // Step 5: Sort recommendations by highest score
    recommendedRecipes.sort((a, b) => b.score - a.score);

    // Step 6: Find the highest-rated recipe
    const topRated = validRecipes.reduce((best, recipe) => {

        if (best === null || recipe.rating > best.rating) {
            return recipe;
        }

        return best;

    }, null);

    // Step 7: Find the best recommendation
    const bestRecommendation = recommendedRecipes[0] || null;

    // Step 8: Display recommended recipes
    console.log("\nRecommended recipes:");

    recommendedRecipes.forEach((recipe) => {

        console.log(
            `${recipe.name} | Rating: ${recipe.rating} | Score: ${recipe.score}`
        );
    });

    // Step 9: Display rejected recipes
    console.log("\nRejected recipes:");

    if (rejectedRecipes.length === 0) {
        console.log("No recipes were rejected.");
    }

    rejectedRecipes.forEach(({ recipe, reason }) => {

        console.log(`${recipe}: ${reason}`);
    });

    // Return useful results for the final report
    return {
        topRated,
        bestRecommendation
    };
}


// ==========================================
// 7. FINAL REPORT
// ==========================================

function generateFinalReport(results) {

    const { topRated, bestRecommendation } = results;

    // Calculate average rating
    const averageRating = recommendedRecipes.length
        ? (
            recommendedRecipes.reduce(
                (total, recipe) => total + recipe.rating, 0
            ) / recommendedRecipes.length
        ).toFixed(2)
        : "0.00";

    // Calculate average preparation time
    const averagePreparation = recommendedRecipes.length
        ? (
            recommendedRecipes.reduce(
                (total, recipe) => total + recipe.prepTimeMinutes, 0
            ) / recommendedRecipes.length
        ).toFixed(1)
        : "0";

    console.log("\n");
    console.log("==========================================");
    console.log("          FINAL PROJECT REPORT");
    console.log("==========================================");

    console.log(`Searches submitted: ${searchQueue.length}`);
    console.log(`Successful searches: ${statistics.successfulSearches}`);
    console.log(`Failed searches: ${statistics.failedSearches}`);

    console.log(`Recipes received: ${statistics.recipesReceived}`);
    console.log(`Valid recipes: ${validRecipes.length}`);
    console.log(`Rejected recipes: ${rejectedRecipes.length}`);
    console.log(`Recommended recipes: ${recommendedRecipes.length}`);

    console.log(`Average rating of recommended recipes: ${averageRating}`);
console.log(`Average preparation time of recommended recipes: ${averagePreparation} min`);

    console.log("\nTop Rated:");

    if (topRated) {
        console.log(`${topRated.name} — ${topRated.rating}`);
    } else {
        console.log("No valid recipes available.");
    }

    console.log("\nBest Recommendation:");

    if (bestRecommendation) {
        console.log(
            `${bestRecommendation.name} — Score ${bestRecommendation.score}`
        );
    } else {
        console.log("No suitable recommendations available.");
    }

    console.log("\n========== EVENT LOG ==========");

    eventLog.forEach((event, index) => {
        console.log(`${index + 1}. ${event}`);
    });

    console.log("\nProject completed successfully!");
}




// ==========================================
// 8. MAIN PROGRAM
// ==========================================

async function main() {

    // First fetch all recipes
    await fetchRecipes();

    // Then run the recommendation engine
    const results = runRecommendationEngine();

    // Finally generate the report
    generateFinalReport(results);
}

// Start the complete system
main();
