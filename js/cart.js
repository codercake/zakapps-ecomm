// cart.js
const cartList = document.querySelector(".cart-items");
const totalBox = document.querySelector(".cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartList.innerHTML = cart
    .map(
      (p) => `
      <div class="cart-row">
        <img src="${p.image}" />
        <div class="info">
          <h4>${p.name}</h4>
          <p>$${p.price}</p>
        </div>
      </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, p) => sum + p.price, 0);
  totalBox.textContent = "$" + total.toFixed(2);
}

renderCart();

document.querySelector("#placeOrder").onclick = () => {
  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
};