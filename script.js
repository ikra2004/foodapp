const baseApiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
let allMeals = [];

const fetchMeals = (query = "") => {
    fetch(`${baseApiUrl}${query}`)
        .then(res => res.json())
        .then(data => {
            if (data.meals) {
                allMeals = data.meals.map(meal => ({
                    ...meal,
                    price: Math.floor(Math.random() * (300 - 50 + 1)) + 50
                }));
                renderMeals(allMeals);
            } else {
                document.getElementById('meal-container').innerHTML = `<p>No meals found!</p>`;
            }
        })
        .catch(err => console.error("Error fetching meals:", err));
};

const renderMeals = (meals) => {
    const container = document.getElementById('meal-container');
    container.innerHTML = meals.map(meal => `
        <div class="meal-card" data-id="${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
            <p>Price: $${meal.price}</p>
        </div>
    `).join("");

    document.querySelectorAll('.meal-card').forEach(card => {
        card.addEventListener('click', () => showMealDetails(card.dataset.id));
    });
};

const showMealDetails = (id) => {
    const meal = allMeals.find(m => m.idMeal === id);
    if (meal) {
        document.getElementById('modal-title').textContent = meal.strMeal;
        document.getElementById('modal-price').textContent = `Price: $${meal.price}`;
        document.getElementById('modal-img').src = meal.strMealThumb;
        document.getElementById('modal-instructions').textContent = meal.strInstructions;

        const modal = document.getElementById('meal-modal');
        modal.style.display = 'flex';

        document.getElementById('modal-back-button').onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
};

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    fetchMeals(query);
});

document.getElementById('low-btn').addEventListener('click', () => {
    const filteredMeals = allMeals.filter(meal => meal.price <= 150);
    renderMeals(filteredMeals);
});

document.getElementById('high-btn').addEventListener('click', () => {
    const filteredMeals = allMeals.filter(meal => meal.price > 150);
    renderMeals(filteredMeals);
});

fetchMeals();
