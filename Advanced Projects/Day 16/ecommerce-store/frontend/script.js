// Use configuration if available, otherwise fallback to localhost
const API_URL = (window.CONFIG && window.CONFIG.API_BASE_URL) || "http://10.219.18.59:5000/api";

function bumpCartVersion() {
  try { localStorage.setItem('cartVersion', String(Date.now())); } catch (_) {}
}

// Utility functions
function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = type === 'success' ? 'success-message' : 'error';
  messageDiv.textContent = message;
  
  const mainContainer = document.querySelector('.main-container');
  if (mainContainer) {
    mainContainer.insertBefore(messageDiv, mainContainer.firstChild);
  } else {
    document.body.appendChild(messageDiv);
  }
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

function showLoading(container) {
  container.innerHTML = '<div class="loading">Loading...</div>';
}

function showError(container, message) {
  container.innerHTML = `<div class="error">${message}</div>`;
}

// Load Products (skip if a custom loader is present on the page)
if (document.getElementById("products") && !window.customProductsLoader) {
  const productsDiv = document.getElementById("products");
  showLoading(productsDiv);
  
  fetch(`${API_URL}/products`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load products');
      return res.json();
    })
    .then(data => {
      productsDiv.innerHTML = "";
      if (data.length === 0) {
        productsDiv.innerHTML = '<div class="empty-cart">No products available.</div>';
        return;
      }
      
      data.forEach(p => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
          <div class="product-image">
            <img src="${p.image || 'https://via.placeholder.com/300x200?text=Product'}" alt="${p.name}">
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <p class="product-description">${p.description || ''}</p>
            <div class="product-price">₹${p.price}</div>
            <div class="qty-controls">
              <button class="qty-btn" onclick="removeFromCart(${p.id})">🗑️</button>
              <span class="qty-count">1</span>
              <button class="qty-btn" onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})">+</button>
            </div>
          </div>
        `;
        productsDiv.appendChild(productCard);
      });
    })
    .catch(err => {
      console.error("Failed to load products:", err);
      showError(productsDiv, "Failed to load products. Please try again later.");
    });
}

// Load Cart
function loadCart() {
  const cartDiv = document.getElementById("cart");
  if (!cartDiv) return;
  
  showLoading(cartDiv);
  
  fetch(`${API_URL}/cart`, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load cart');
      return res.json();
    })
    .then(data => {
      cartDiv.innerHTML = "";
      
      if (data.length === 0) {
        cartDiv.innerHTML = `
          <div class="empty-cart">
            <p>Your cart is empty.</p>
            <a href="products.html" class="cta-button">Start Shopping</a>
          </div>
        `;
        return;
      }
      
      let total = 0;
      data.forEach(item => {
        const qty = (item.quantity || 1);
        total += item.price * qty;
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <div class="cart-item-price">₹${item.price} × ${qty} = ₹${item.price * qty}</div>
          </div>
          <div class="right-actions">
            <div class="qty-controls">
              <button class="qty-btn" onclick="decrementCart(${item.id})">🗑️</button>
              <span class="qty-count">${qty}</span>
              <button class="qty-btn" onclick="incrementCart(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price})">+</button>
            </div>
            <button class="delete-small" onclick="deleteFromCart(${item.id})">Delete</button>
          </div>
        `;
        cartDiv.appendChild(cartItem);
      });
      
      const cartTotal = document.createElement("div");
      cartTotal.className = "cart-total";
      cartTotal.innerHTML = `
        <strong>Total: ₹${total}</strong>
        <br>
        <button class="checkout-btn" onclick="checkout()">
          Proceed to Checkout
        </button>
      `;
      cartDiv.appendChild(cartTotal);
    })
    .catch(err => {
      console.error("Failed to load cart:", err);
      showError(cartDiv, "Failed to load cart. Please try again later.");
    });
}

if (document.getElementById("cart")) {
  loadCart();
}

// Add to Cart
function addToCart(id, name, price) {
  const button = event && event.target ? event.target : null;
  const originalText = button ? button.textContent : null;
  if (button) { button.textContent = 'Adding...'; button.disabled = true; }
  
  return fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, price })
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to add item to cart');
    return res.json();
  })
  .then(() => {
    showMessage("Item added to cart successfully!");
    bumpCartVersion();
    if (button) {
      button.textContent = originalText || 'Add';
      button.disabled = false;
    }
    if (document.getElementById('cart')) loadCart();
  })
  .catch(err => {
    console.error("Add to cart failed:", err);
    showMessage("Failed to add item to cart. Please try again.", 'error');
    if (button) {
      button.textContent = originalText || 'Add';
      button.disabled = false;
    }
  });
}

// Decrement one from cart (used in cart and on product cards)
function removeFromCart(id) {
  return fetch(`${API_URL}/cart/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to remove item from cart');
    return res.json();
  })
  .then(() => {
    showMessage("Item updated.");
    bumpCartVersion();
    if (document.getElementById('cart')) loadCart();
  })
  .catch(err => {
    console.error("Remove failed:", err);
    showMessage("Failed to update item. Please try again.", 'error');
  });
}

function decrementCart(id) {
  removeFromCart(id);
}

function incrementCart(id, name, price) {
  addToCart(id, name, price);
}

// Delete item entirely
function deleteFromCart(id) {
  fetch(`${API_URL}/cart/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
  })
  .then(() => {
    showMessage("Item deleted from cart");
    bumpCartVersion();
    if (document.getElementById('cart')) loadCart();
  })
  .catch(err => {
    console.error("Delete failed:", err);
    showMessage("Failed to delete item. Please try again.", 'error');
  });
}

// Cross-tab/page sync: listen for cartVersion changes to refresh relevant UI
window.addEventListener('storage', (e) => {
  if (e.key === 'cartVersion') {
    // On products page we don't auto rebuild cards, but might update chips later
    if (document.getElementById('cart')) {
      loadCart();
    }
  }
});

// Checkout function - Updated to use Stripe Checkout
function checkout() {
  const checkoutBtn = event.target;
  const originalText = checkoutBtn.textContent;
  checkoutBtn.textContent = 'Processing...';
  checkoutBtn.disabled = true;

  // Get cart items and send to backend for Stripe checkout
  fetch(`${API_URL}/cart`, { cache: 'no-store' })
    .then(res => res.json())
    .then(cartItems => {
      if (!cartItems || cartItems.length === 0) {
        showMessage("Cart is empty.", 'error');
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
        return;
      }
      // Send cart items to backend Stripe endpoint
      return fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error || !data.url) {
          showMessage("Failed to create Stripe checkout session.", 'error');
          checkoutBtn.textContent = originalText;
          checkoutBtn.disabled = false;
          return;
        }
        // Redirect to Stripe checkout page
        window.location.href = data.url;
      });
    })
    .catch(err => {
      showMessage("Checkout failed. Please try again.", 'error');
      checkoutBtn.textContent = originalText;
      checkoutBtn.disabled = false;
    });
}

// Add smooth scrolling and other UX improvements
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add loading animation to buttons
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
      if (!this.disabled) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      }
    });
  });
});
