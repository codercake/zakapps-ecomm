// detail.js
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const product = window.PRODUCTS.find((p) => p.id === id);

const imgBox = document.querySelector(".detail-image");
const titleBox = document.querySelector(".detail-title");
const priceBox = document.querySelector(".detail-price");
const ratingBox = document.querySelector(".detail-rating");
const descBox = document.querySelector(".detail-description");

if (product) {
  imgBox.src = product.image;
  titleBox.textContent = product.name;
  priceBox.textContent = "$" + product.price;
  ratingBox.textContent = "⭐ " + product.rating;
  descBox.textContent = product.description;
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartIcon() {
  document.querySelector(".cart-count").textContent = cart.length;
}

updateCartIcon();

document.querySelector("#addToCart").onclick = () => {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIcon();
  alert("Added to cart!");
};

document.querySelector("#buyNow").onclick = () => {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
};
