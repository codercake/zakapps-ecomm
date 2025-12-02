document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'), 10);
  
  if (typeof products === 'undefined') {
      showErrorMessage("Product data not available.");
      return;
  }
  
  if (!productId || isNaN(productId)) {
      showErrorMessage("Invalid product ID.");
      return;
  }
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
      showErrorMessage("Product not found.");
      return;
  }
  
  updateProductInfo(product);
  setTimeout(setupThumbnailClicks, 100);
  setupNavigationArrows(productId);
  setupAddToCartButton(product);
  setupBuyNowButton(product);
  setupTabFunctionality();
  updateDescriptionContent();
  setupProductPreview();
});

function updateProductInfo(product) {
  const breadcrumbName = document.getElementById("product-breadcrumb-name");
  if (breadcrumbName) {
      breadcrumbName.textContent = product.name || "OKAZU Lovers Set (z30ml/12 jars)";
  }

  const productTitle = document.getElementById("product-title");
  if (productTitle) {
      productTitle.textContent = product.name || "OKAZU Lovers Set (z30ml/12 jars)";
  }
  
  const productPrice = document.getElementById("product-price");
  if (productPrice) {
      productPrice.textContent = `$${product.price ? product.price.toFixed(2) : '135.00'}`;
  }
  
  const oldPrice = document.getElementById("product-old-price");
  if (oldPrice) {
      if (product.oldPrice) {
          oldPrice.textContent = `$${product.oldPrice.toFixed(2)}`;
          oldPrice.style.display = "inline";
      } else {
          oldPrice.style.display = "none";
      }
  }
  
  const starsContainer = document.getElementById("product-stars");
  if (starsContainer) {
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
          starsHTML += `<img src="assets/icons/ratings.svg" alt="star" />`;
      }
      starsContainer.innerHTML = starsHTML;
  }
  
  const reviewsCount = document.getElementById("product-reviews");
  if (reviewsCount) {
      reviewsCount.textContent = `${product.reviews || '32'} Reviews`;
  }
  
  const shortDesc = document.getElementById("product-short-desc");
  if (shortDesc) {
      shortDesc.textContent = product.shortDesc || 
          "Your new cooking BFF! You can add this to virtually everything. Try it on rice, on meat or tofu, in your burger, ramen and pretty much anything.";
  }
  
  const mainImg = document.getElementById("product-main-img");
  if (mainImg && product.img) {
      mainImg.src = product.img;
      mainImg.alt = product.name || "OKAZU Lovers Set";
  }
  
  const thumbsContainer = document.getElementById("product-thumbnails");
  if (thumbsContainer) {
      let allThumbs = [];
      
      if (product.img) {
          allThumbs.push(product.img);
      }
      
      if (product.thumbnail && Array.isArray(product.thumbnail)) {
          allThumbs = allThumbs.concat(product.thumbnail.slice(0, 2));
      }
      
      if (allThumbs.length < 3) {
          for (let i = allThumbs.length; i < 3; i++) {
              allThumbs.push(product.img || 'assets/images/default-product.jpg');
          }
      }
      
      thumbsContainer.innerHTML = allThumbs
          .slice(0, 3)
          .map((src, index) => 
              `<img class="thumb ${index === 0 ? 'active' : ''}" 
                    src="${src}" 
                    alt="${product.name || 'Product'} thumbnail ${index + 1}"
                    data-index="${index}">`
          )
          .join('');
  }
}

function setupThumbnailClicks() {
  const mainImg = document.getElementById("product-main-img");
  const thumbs = document.querySelectorAll(".thumb");
  
  if (mainImg && thumbs.length > 0) {
      thumbs.forEach(thumb => {
          thumb.addEventListener("click", function() {
              mainImg.src = this.src;
              thumbs.forEach(t => t.classList.remove("active"));
              this.classList.add("active");
              
              mainImg.style.opacity = '0.7';
              setTimeout(() => {
                  mainImg.style.opacity = '1';
              }, 100);
          });
      });
  }
}

function setupNavigationArrows(currentProductId) {
  if (typeof products === 'undefined' || !Array.isArray(products)) {
      return;
  }
  
  const currentIndex = products.findIndex(p => p.id === currentProductId);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;
  
  const galleryContainer = document.querySelector('.product-gallery-container');
  if (galleryContainer) {
      const existingNav = galleryContainer.querySelector('.product-navigation');
      if (existingNav) {
          existingNav.remove();
      }
      
      const navContainer = document.createElement('div');
      navContainer.className = 'product-navigation';
      navContainer.innerHTML = `
          <button class="nav-arrow prev-arrow" ${!prevProduct ? 'disabled' : ''}>
              <img src="assets/icons/left-arrow.png" alt="Previous product">
          </button>
          <button class="nav-arrow next-arrow" ${!nextProduct ? 'disabled' : ''}>
              <img src="assets/icons/right-arrow.png" alt="Next product">
          </button>
      `;
      
      galleryContainer.appendChild(navContainer);
      
      const prevArrow = navContainer.querySelector('.prev-arrow');
      const nextArrow = navContainer.querySelector('.next-arrow');
      
      if (prevProduct && prevArrow) {
          prevArrow.addEventListener('click', function() {
              navigateToProduct(prevProduct.id, false);
          });
      }
      
      if (nextProduct && nextArrow) {
          nextArrow.addEventListener('click', function() {
              navigateToProduct(nextProduct.id, false);
          });
      }
  }
}

function updateProductPreview() {
  const previewImages = document.getElementById('preview-images');
  if (!previewImages) return;
  
  if (typeof products === 'undefined' || !Array.isArray(products) || products.length === 0) {
      previewImages.innerHTML = '<p>No products available</p>';
      return;
  }
  
  let html = '';
  products.slice(0, 6).forEach((product, index) => {
      html += `
          <div class="preview-item" data-product-id="${product.id}">
              <img src="${product.img || 'assets/images/default-product.jpg'}" alt="${product.name}">
              <div class="preview-info">
                  <h4>${product.name}</h4>
                  <div class="preview-price">
                      <span class="current-price">$${product.price.toFixed(2)}</span>
                      ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                  </div>
              </div>
          </div>
      `;
  });
  
  previewImages.innerHTML = html;
  
  const previewItems = document.querySelectorAll('.preview-item');
  previewItems.forEach(item => {
      item.addEventListener('click', function() {
          const productId = parseInt(this.getAttribute('data-product-id'));
          navigateToProduct(productId, false);
      });
  });
}

function setupPreviewArrows() {
  const previewImages = document.getElementById('preview-images');
  const leftArrow = document.getElementById('preview-left');
  const rightArrow = document.getElementById('preview-right');
  
  if (!previewImages || !leftArrow || !rightArrow) return;
  
  let currentScroll = 0;
  const itemWidth = 180;
  
  leftArrow.addEventListener('click', function() {
      if (currentScroll > 0) {
          currentScroll -= itemWidth;
          previewImages.scrollTo({
              left: currentScroll,
              behavior: 'smooth'
          });
      }
  });
  
  rightArrow.addEventListener('click', function() {
      const maxScroll = previewImages.scrollWidth - previewImages.clientWidth;
      if (currentScroll < maxScroll) {
          currentScroll += itemWidth;
          previewImages.scrollTo({
              left: currentScroll,
              behavior: 'smooth'
          });
      }
  });
}

function navigateToProduct(productId, scrollToTop = false) {
  document.body.style.cursor = 'wait';
  
  const newUrl = window.location.pathname + '?id=' + productId;
  window.history.pushState({ productId: productId }, '', newUrl);
  
  const newProduct = products.find(p => p.id === productId);
  if (newProduct) {
      updateProductInfo(newProduct);
      setTimeout(setupThumbnailClicks, 50);
      
      if (scrollToTop) {
          const productSection = document.querySelector('.product-detail-section');
          if (productSection) {
              productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }
      
      document.querySelector('.product-navigation')?.remove();
      setupNavigationArrows(productId);
      updateDescriptionContent();
      updateProductPreview();
  }
  
  setTimeout(() => {
      document.body.style.cursor = 'default';
  }, 300);
}

function setupAddToCartButton(product) {
  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function() {
          const originalText = addToCartBtn.textContent;
          addToCartBtn.textContent = "ADDING...";
          addToCartBtn.disabled = true;
          
          setTimeout(() => {
              if (typeof incrementCartCount === 'function') {
                  incrementCartCount();
                  showToast(`${product.name} added to cart!`);
                  addToCartBtn.textContent = "✓ ADDED";
                  addToCartBtn.style.backgroundColor = "#4CAF50";
                  
                  setTimeout(() => {
                      addToCartBtn.textContent = originalText;
                      addToCartBtn.disabled = false;
                      addToCartBtn.style.backgroundColor = "";
                  }, 2000);
              } else {
                  alert("Cart functionality not available");
                  addToCartBtn.textContent = originalText;
                  addToCartBtn.disabled = false;
              }
          }, 500);
      });
  }
}

function setupBuyNowButton(product) {
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function() {
          if (typeof incrementCartCount === 'function') {
              incrementCartCount();
              buyNowBtn.textContent = "PROCESSING...";
              buyNowBtn.disabled = true;
              
              setTimeout(() => {
                  window.location.href = "order.html";
              }, 800);
          } else {
              alert("Checkout functionality not available");
          }
      });
  }
}

function setupTabFunctionality() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  
  if (tabButtons.length > 0) {
      tabButtons.forEach(button => {
          button.addEventListener("click", function() {
              const tabId = this.getAttribute("data-tab");
              
              tabButtons.forEach(btn => btn.classList.remove("active"));
              this.classList.add("active");
              
              tabPanels.forEach(panel => {
                  panel.classList.remove("active");
                  if (panel.id === tabId) {
                      panel.classList.add("active");
                  }
              });
          });
      });
  }
}

function updateDescriptionContent() {
  const descriptionPanel = document.getElementById("description");
  if (!descriptionPanel) return;
  
  descriptionPanel.innerHTML = `
      <p>Your new cooking BFF! You can add this to virtually everything. Try it on rice, on meat or tofu, in your burger, ramen and pretty much anything. These award winning products will have your taste buds lingering for more...and potentially create an addiction.</p>
      
      <p>Chili OKAZU is an umami-rich chili, miso, and sesame oil based condiment often eaten with rice in Japan, which can also be used to top chicken, burgers, fish, eggs, potatoes, and more.</p>
      
      <p>Use it as a marinade or as an ingredient in your own homemade salad dressing, this condiment is versatile and we encourage you to experiment.</p>
      
      <p>OKAZU gained an initial following at farmers' markets in Toronto and has been featured in The Toronto Star, The National Post, Toronto Life, FoodiePages and a winner of the Foodie Pick Awards.</p>
      
      <br />
      
      <p><strong>HEAT LEVEL: MILD-MEDIUM</strong></p>
      
      <br />
      
      <p><strong>INGREDIENTS:</strong> SUNFLOWER OIL, SESAME OIL, GARLIC, MISO PASTE (ORGANIC SOYBEANS, RICE, SALT), TAMARI SOY SAUCE (NON-GMO SOYBEANS, SALT, SUGAR), SUGAR, CHILI POWDER, WHITE SESAME SEEDS</p>
      
      <p><strong>CHILI & SPICY OKAZU CONTAINS:</strong> SESAME, SOYBEANS. MAY CONTAIN: MUSTARD.</p>
      
      <p><strong>CURRY OKAZU CONTAINS:</strong> SESAME, SOYBEANS, MUSTARD.</p>
      
      <br />
      
      <p><strong>INGREDIENTS:</strong> PRODUCT SEPARATION IS NORMAL. REFRIGERATE AFTER OPENING</p>
  `;
  
  const reviewsPanel = document.getElementById("reviews");
  if (reviewsPanel) {
      reviewsPanel.innerHTML = "";
  }
  
  const videosPanel = document.getElementById("videos");
  if (videosPanel) {
      videosPanel.innerHTML = "";
  }
  
  const commentsPanel = document.getElementById("comments");
  if (commentsPanel) {
      commentsPanel.innerHTML = "";
  }
}

function showErrorMessage(message) {
  const productSection = document.querySelector(".product-detail-section");
  if (productSection) {
      productSection.innerHTML = `
          <div class="error-message">
              <h2>Error Loading Product</h2>
              <p>${message}</p>
              <button onclick="window.location.href='products.html'" class="btn">
                  Back to Products
              </button>
          </div>
      `;
  }
}

function showToast(message) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
      existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 25px;
      border-radius: 4px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
          if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
          }
      }, 300);
  }, 3000);
}

if (!document.querySelector('#toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
      @keyframes slideIn {
          from {
              transform: translateX(100%);
              opacity: 0;
          }
          to {
              transform: translateX(0);
              opacity: 1;
          }
      }
      
      @keyframes slideOut {
          from {
              transform: translateX(0);
              opacity: 1;
          }
          to {
              transform: translateX(100%);
              opacity: 0;
          }
      }
      
      .error-message {
          text-align: center;
          padding: 50px 20px;
      }
      
      .error-message h2 {
          color: #ff4444;
          margin-bottom: 20px;
      }
      
      .error-message .btn {
          margin-top: 20px;
          background: #333;
          color: white;
          border: none;
          padding: 12px 24px;
          cursor: pointer;
      }
      
      .product-preview-section {
          margin-top: 40px;
          padding: 20px 0;
          border-top: 1px solid #eee;
      }
      
      .product-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          max-width: 800px;
          margin: 0 auto;
      }
      
      .preview-images {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 10px;
          width: 600px;
          scrollbar-width: none;
      }
      
      .preview-images::-webkit-scrollbar {
          display: none;
      }
      
      .preview-item {
          flex: 0 0 auto;
          width: 180px;
          cursor: pointer;
          text-align: center;
          transition: transform 0.3s ease;
      }
      
      .preview-item:hover {
          transform: translateY(-5px);
      }
      
      .preview-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 10px;
      }
      
      .preview-info h4 {
          font-size: 14px;
          margin: 5px 0;
          color: #333;
      }
      
      .preview-price {
          display: flex;
          justify-content: center;
          gap: 8px;
          align-items: center;
      }
      
      .current-price {
          font-weight: bold;
          color: #333;
      }
      
      .old-price {
          color: #999;
          text-decoration: line-through;
          font-size: 14px;
      }
      
      .preview-arrow {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
      }
      
      .preview-arrow:hover {
          background: #f5f5f5;
          border-color: #999;
      }
      
      .preview-arrow img {
          width: 20px;
          height: 20px;
      }
      
      .product-thumbnails {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
      }
      
      .product-thumbnails .thumb {
          width: 60px;
          height: 60px;
          object-fit: cover;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 4px;
      }
      
      .product-thumbnails .thumb.active {
          border-color: #333;
      }
  `;
  document.head.appendChild(style);
}

window.addEventListener('popstate', function(event) {
  if (event.state && event.state.productId) {
      const product = products.find(p => p.id === event.state.productId);
      if (product) {
          updateProductInfo(product);
          setTimeout(setupThumbnailClicks, 50);
          document.querySelector('.product-navigation')?.remove();
          setupNavigationArrows(event.state.productId);
          updateDescriptionContent();
          updateProductPreview();
      }
  }
});