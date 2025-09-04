# E-commerce Store (Demo)

## Structure
- backend/ : Node.js + Express backend (product & cart APIs, Stripe payment intent)
- frontend/: Static HTML/CSS/JS

## Quick start (local)
1. Open terminal.
2. Start backend:
   ```
   cd backend
   npm install
   cp .env.example .env
   # edit .env and add your STRIPE_SECRET_KEY (test key)
   npm start
   ```
3. Serve frontend:
   - Option A: Open `frontend/products.html` directly in browser (some browsers may block fetch due to CORS/file origin — prefer Option B)
   - Option B: Serve static files with a simple server, e.g.:
     ```
     # from project root
     npx http-server frontend -p 8080
     # then open http://localhost:8080/products.html
     ```
4. Use the UI to add items, go to cart and click **Proceed to Checkout**. You will receive a test `clientSecret` from the backend if Stripe is configured.

## Notes
- This project uses an in-memory cart on the backend (not persistent).
- Payment uses Stripe PaymentIntents in test mode. No real charges occur with test keys.
