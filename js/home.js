const gridContainer = document.querySelector(".product-grid");
const emptyMsg = document.querySelector(".no-products-message");
const productCountEl = document.querySelector(".product-count");
const categoryCheckboxes = document.querySelectorAll(".filter-category");
const typeCheckboxes = document.querySelectorAll(".filter-type");
const ratingCheckboxes = document.querySelectorAll(".filter-rating");
const sortDropdown = document.getElementById("sortDropdown");
const filterBtn = document.querySelector(".filter-btn");
const filterPanel = document.getElementById("FilterPanel");
const gridBtn = document.querySelector(".grid-icon");
const listBtn = document.querySelector(".list-icon");

console.log("home.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    if (products && products.length > 0) {
        applyFiltersAndSortAndRender();
    } else {
        if (emptyMsg) {
            emptyMsg.style.display = "block";
            emptyMsg.textContent = "No products available. Please check back later.";
        }
    }
});

function generateStars(count) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += `<img src="assets/icons/ratings.svg" alt="star" />`;
    }
    return stars;
}


function renderProducts(productList) {
    if (!gridContainer) return;

    console.log(`Rendering ${productList.length} products`);
    gridContainer.innerHTML = "";

    productList.forEach((product) => {
        const needsWhiteBg = product.name.includes("CHILI MISO") || 
                            product.name.includes("Chili Miso") ||
                            product.img.includes("okazu-chilli");
        const bgClass = needsWhiteBg ? "white-bg" : "transparent-bg";
        
        const productCard = `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.img}" class="product-img ${bgClass}" alt="${product.name}" />
                <div class="product-details">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="price-row">
                        <span class="current">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old">$${product.oldPrice.toFixed(2)}</span>` : ""}
                    </div>
                    <div class="rating-row">
                        <div class="stars">${generateStars(5)}</div> <!-- Always pass 5 -->
                        <span class="reviews">${product.reviews} Reviews</span>
                    </div>
                </div>
            </div>
        `;
        gridContainer.insertAdjacentHTML("beforeend", productCard);
    });

    attachCardClickEvents();

    const count = productList.length;
    if (productCountEl) productCountEl.textContent = `(${count})`;
    if (emptyMsg) emptyMsg.style.display = count === 0 ? "block" : "none";
}

function getSelectedValues(nodeList) {
    return [...nodeList].filter((cb) => cb.checked).map((cb) => cb.value);
}

function getFilteredProducts() {
    if (!products || products.length === 0) return [];

    let filtered = [...products];
    const selectedCategories = getSelectedValues(categoryCheckboxes);
    const selectedTypes = getSelectedValues(typeCheckboxes);
    const selectedRatings = getSelectedValues(ratingCheckboxes).map(Number);

    if (selectedCategories.length > 0) {
        filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedTypes.length > 0) {
        filtered = filtered.filter((p) => selectedTypes.includes(p.type));
    }
    if (selectedRatings.length > 0) {
        const minRating = Math.min(...selectedRatings);
        filtered = filtered.filter((p) => p.stars >= minRating);
    }

    return filtered;
}

function applyFiltersAndSortAndRender() {
    const filtered = getFilteredProducts();
    const sortValue = sortDropdown ? sortDropdown.value : "az";
    let toRender = [...filtered];

    switch (sortValue) {
        case "az": toRender.sort((a, b) => a.name.localeCompare(b.name)); break;
        case "za": toRender.sort((a, b) => b.name.localeCompare(a.name)); break;
        case "low-high": toRender.sort((a, b) => a.price - b.price); break;
        case "high-low": toRender.sort((a, b) => b.price - a.price); break;
    }

    renderProducts(toRender);
}

function attachCardClickEvents() {
    const cards = document.querySelectorAll(".product-card");
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
            const productId = card.getAttribute("data-id");
            window.location.href = `product-listing.html?id=${productId}`;
        });
    });
}

function setupEventListeners() {
    categoryCheckboxes.forEach((cb) => cb.addEventListener("change", applyFiltersAndSortAndRender));
    typeCheckboxes.forEach((cb) => cb.addEventListener("change", applyFiltersAndSortAndRender));
    ratingCheckboxes.forEach((cb) => cb.addEventListener("change", applyFiltersAndSortAndRender));
    if (sortDropdown) sortDropdown.addEventListener("change", applyFiltersAndSortAndRender);
    if (filterBtn && filterPanel) filterBtn.addEventListener("click", () => filterPanel.classList.toggle("active"));
    if (gridBtn && listBtn) {
        gridBtn.addEventListener("click", () => {
            if (gridContainer) {
                gridContainer.classList.remove("list-view");
                gridBtn.classList.add("active");
                listBtn.classList.remove("active");
            }
        });
        listBtn.addEventListener("click", () => {
            if (gridContainer) {
                gridContainer.classList.add("list-view");
                listBtn.classList.add("active");
                gridBtn.classList.remove("active");
            }
        });
    }
}

function initializePage() {
    setupEventListeners();
    if (products && products.length > 0) {
        renderProducts(products);
    } else {
        if (emptyMsg) {
            emptyMsg.style.display = "block";
            emptyMsg.textContent = "No products available at the moment.";
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}