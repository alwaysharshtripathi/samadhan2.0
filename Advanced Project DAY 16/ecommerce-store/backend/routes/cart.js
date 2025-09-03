const express = require("express");
const router = express.Router();
let cart = [];

// Get cart
router.get("/", (req, res) => {
  res.json(cart);
});

// Helper to find item index
function findItemIndex(id) {
  return cart.findIndex(item => item.id === id);
}

// Add to cart (increments quantity if exists)
router.post("/add", (req, res) => {
  const { id, name, price } = req.body;
  if (!id || !name || typeof price !== "number") {
    return res.status(400).json({ error: "id, name and price (number) required" });
  }
  const idx = findItemIndex(id);
  if (idx >= 0) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  res.json({ message: "Added to cart", cart });
});

// Remove one quantity from cart (decrement, remove if zero)
router.post("/remove", (req, res) => {
  const { id } = req.body;
  const idx = findItemIndex(id);
  if (idx === -1) {
    return res.status(404).json({ error: "Item not in cart" });
  }
  cart[idx].quantity -= 1;
  if (cart[idx].quantity <= 0) {
    cart.splice(idx, 1);
  }
  res.json({ message: "Updated cart", cart });
});

// Delete item entirely from cart
router.post("/delete", (req, res) => {
  const { id } = req.body;
  cart = cart.filter(item => item.id !== id);
  res.json({ message: "Item deleted", cart });
});

// Clear cart (useful for testing)
router.post("/clear", (req, res) => {
  cart = [];
  res.json({ message: "Cart cleared", cart });
});

module.exports = router;
