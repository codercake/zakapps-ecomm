const listContainer = document.querySelector(".products-list");
const searchInput = document.querySelector("#search");
const categoryFilters = document.querySelectorAll(".filter-category");
const typeFilters = document.querySelectorAll(".filter-type");
const flavourFilters = document.querySelectorAll(".filter-flavour");
const sortDropdown = document.querySelector("#sort");

let filteredProducts = [...window.PRODUCTS];

function renderProducts(list) {
  listContainer.innerHTML = list
    .map(
      (p) => `
      <div class="product-card" onclick="openDetail(${p.id})">
        <img src="${p.image}" alt="${p.name}"/>
        <h3>${p.name}</h3>
        <p class="price">$${p.price}</p>
        <p class="rating">⭐ ${p.rating}</p>
      </div>
    `
    )
    .join("");
}

renderProducts(filteredProducts);

function applyFilters() {
  let list = [...window.PRODUCTS];

  const selectedCategories = [...categoryFilters]
    .filter((c) => c.checked)
    .map((c) => c.value);

  const selectedTypes = [...typeFilters]
    .filter((t) => t.checked)
    .map((t) => t.value);

  const selectedFlavours = [...flavourFilters]
    .filter((f) => f.checked)
    .map((f) => f.value);

  list = list.filter((p) => {
    const catOK = selectedCategories.length
      ? selectedCategories.includes(p.category)
      : true;

    const typeOK = selectedTypes.length
      ? selectedTypes.includes(p.type)
      : true;

    const flavourOK = selectedFlavours.length
      ? selectedFlavours.includes(p.flavour)
      : true;

    return catOK && typeOK && flavourOK;
  });

  const q = searchInput.value.toLowerCase();
  list = list.filter((p) => p.name.toLowerCase().includes(q));

  if (sortDropdown.value === "price-asc")
    list.sort((a, b) => a.price - b.price);

  if (sortDropdown.value === "price-desc")
    list.sort((a, b) => b.price - a.price);

  if (sortDropdown.value === "rating")
    list.sort((a, b) => b.rating - a.rating);

  filteredProducts = list;
  renderProducts(list);
}

searchInput.addEventListener("input", applyFilters);
categoryFilters.forEach((c) => c.addEventListener("change", applyFilters));
typeFilters.forEach((t) => t.addEventListener("change", applyFilters));
flavourFilters.forEach((f) => f.addEventListener("change", applyFilters));
sortDropdown.addEventListener("change", applyFilters);

function openDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}
