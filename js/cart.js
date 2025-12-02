const cartCountElement = document.getElementById("cartCount");
let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;

if (cartCountElement) cartCountElement.textContent = cartCount;

window.incrementCartCount = function () {
  cartCount += 1;
  localStorage.setItem("cartCount", cartCount);
  if (cartCountElement) cartCountElement.textContent = cartCount;
};
