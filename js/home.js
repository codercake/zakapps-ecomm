importProducts();

function importProducts() {
  const container = document.querySelector(".featured-products");

  if (!container) return;

  const featured = window.PRODUCTS.slice(0, 3); 

  container.innerHTML = featured
    .map(
      (p) => `
      <div class="product-card" onclick="openDetail(${p.id})">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p class="price">$${p.price}</p>
      </div>
    `
    )
    .join("");
}

function openDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}
