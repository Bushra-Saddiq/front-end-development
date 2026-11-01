
console.log("==================================");
console.log("   RECIPE RECOMMENDATION SYSTEM");
console.log("==================================");

// 1. SEARCH QUEUE AND VALIDATION
const searchQueue = [
    "pasta", "pizza", "chicken", "sushi", "dessert",
    "", 123, "pasta", "   pizza   "
];

const validSearches = [];
const eventLog = [];
const searched = new Set();

searchQueue.forEach((search, index) => {
    if (typeof search !== "string" || !search.trim()) {
        const msg = `Search #${index + 1}: Invalid search`;
        console.log("⚠", msg);
        eventLog.push(msg);
        return;
    }

    const term = search.trim().toLowerCase();

    if (searched.has(term)) {
        const msg = `Duplicate search skipped: ${term}`;
        console.log("⚠", msg);
        eventLog.push(msg);
        return;
    }

    searched.add(term);
    validSearches.push(term);
    eventLog.push(`Valid search: ${term}`);
});

console.log("\nValid searches:", validSearches);

// 2. RECIPE VALIDATION
function validateRecipe(r) {
    return r &&
        Number.isInteger(r.id) && r.id > 0 &&
        typeof r.name === "string" && r.name.trim() &&
        typeof r.rating === "number" &&
        Number.isFinite(r.rating) && r.rating >= 0 && r.rating <= 5 &&
        ["easy", "medium", "hard"].includes(
            typeof r.difficulty === "string"
                ? r.difficulty.trim().toLowerCase() : ""
        ) &&
        typeof r.cuisine === "string" && r.cuisine.trim() &&
        typeof r.prepTimeMinutes === "number" &&
        Number.isFinite(r.prepTimeMinutes) && r.prepTimeMinutes >= 0;
}

function isSuitable(r) {
    return validateRecipe(r) && r.rating >= 4 &&
        r.prepTimeMinutes <= 60 &&
        r.difficulty.trim().toLowerCase() !== "hard";
}

// 3. API HANDLER
const allRecipes = [];
const stats = {
    successful: 0,
    failed: 0,
    received: 0
};

async function fetchRecipes() {
    for (const search of validSearches) {
        console.log(`\n🔎 Searching recipes for: ${search}...`);

        try {
            const response = await fetch(
                `https://dummyjson.com/recipes/search?q=${encodeURIComponent(search)}`
            );

            if (!response.ok) throw new Error(`API error ${response.status}`);

            const data = await response.json();
            const recipes = data.recipes || [];

            if (!recipes.length) {
                stats.failed++;
                const msg = `No recipes found for "${search}"`;
                console.log("⚠", msg);
                eventLog.push(msg);
                console.log(`⚠ No suitable recipes found for "${search}"`);
                continue;
            }

            allRecipes.push(...recipes);
            stats.successful++;
            stats.received += recipes.length;

            console.log(`✓ Received ${recipes.length} recipes`);
            eventLog.push(`Received ${recipes.length} recipes for ${search}`);

            const count = recipes.filter(isSuitable).length;
            const msg = count
                ? `Found ${count} suitable recipes for "${search}"`
                : `No suitable recipes found for "${search}"`;

            console.log(count ? "✓" : "⚠", msg);
            eventLog.push(msg);

        } catch (error) {
            stats.failed++;
            const msg = `Search "${search}" failed: ${error.message}`;
            console.log("⚠", msg);
            eventLog.push(msg);
        }
    }
}

// 4. RECOMMENDATION ENGINE
function recommendRecipes() {
    const valid = [];
    const rejected = [];
    const ids = new Set();

    allRecipes.forEach(r => {
        if (validateRecipe(r)) {
            valid.push(r);
        } else {
            rejected.push({ name: r?.name || "Unknown", reason: "Invalid data" });
            eventLog.push(`Rejected invalid recipe: ${r?.name || "Unknown"}`);
        }
    });

    const suitable = valid.filter(r => {
        if (isSuitable(r)) return true;

        rejected.push({ name: r.name, reason: "Not suitable" });
        eventLog.push(`Rejected unsuitable recipe: ${r.name}`);
        return false;
    });

    const scored = suitable.map(r => {
        const difficulty = r.difficulty.toLowerCase();
        const score = (r.rating / 5 * 50) +
            ((60 - r.prepTimeMinutes) / 60 * 30) +
            (difficulty === "easy" ? 20 : 10);

        return { ...r, score: Math.round(score) };
    });

    const recommendations = [];

    scored.forEach(r => {
        if (ids.has(r.id)) {
            eventLog.push(`Duplicate recipe removed: ${r.name}`);
        } else {
            ids.add(r.id);
            recommendations.push(r);
        }
    });

    recommendations.sort((a, b) => b.score - a.score);

    const highest = valid.reduce(
        (max, r) => Math.max(max, r.rating), 0
    );
    const topRated = valid.find(r => r.rating === highest);
    const best = recommendations[0];

    console.log("\n========== RECOMMENDATIONS ==========");
    recommendations.forEach(({ name, rating, score }) =>
        console.log(`${name} | Rating: ${rating} | Score: ${score}`)
    );

    console.log("\n========== REJECTED RECIPES ==========");
    if (!rejected.length) console.log("No recipes rejected.");
    rejected.forEach(({ name, reason }) =>
        console.log(`${name}: ${reason}`)
    );

    return { valid, rejected, recommendations, topRated, best };
}

// 5. FINAL REPORT
function finalReport(result) {
    const { valid, rejected, recommendations, topRated, best } = result;

    const averageRating = recommendations.length
        ? (recommendations.reduce((sum, r) => sum + r.rating, 0) /
            recommendations.length).toFixed(2)
        : "0.00";

    const averageTime = recommendations.length
        ? (recommendations.reduce((sum, r) => sum + r.prepTimeMinutes, 0) /
            recommendations.length).toFixed(1)
        : "0.0";

    console.log("\n========== FINAL REPORT ==========");
    console.log("Searches submitted:", searchQueue.length);
    console.log("Successful searches:", stats.successful);
    console.log("Failed searches:", stats.failed);
    console.log("Recipes received:", stats.received);
    console.log("Valid recipes:", valid.length);
    console.log("Rejected recipes:", rejected.length);
    console.log("Recommended recipes:", recommendations.length);
    console.log("Average rating:", averageRating);
    console.log("Average preparation time:", averageTime, "min");
    console.log("Top rated:", topRated?.name || "None");
    console.log("Best recommendation:", best?.name || "None");

    console.log("\n========== EVENT LOG ==========");
    eventLog.forEach((event, i) =>
        console.log(`${i + 1}. ${event}`)
    );

    console.log("\nProject completed successfully!");
}

// 6. MAIN PROGRAM
async function main() {
    await fetchRecipes();
    const results = recommendRecipes();
    finalReport(results);
}

main();
