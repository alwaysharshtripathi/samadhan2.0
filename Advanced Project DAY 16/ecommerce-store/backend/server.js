require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:8080', 
      'http://localhost:5000', 
      'http://127.0.0.1:3000', 
      'http://127.0.0.1:8080', 
      'http://127.0.0.1:5000',
      'http://10.219.18.59:3000',
      'http://10.219.18.59:8080',
      'http://10.7.131.62:3000',  // Add the new frontend origin
      'http://10.7.131.62:8080'   // In case you change the port
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Routes
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const reviewRoutes = require("./routes/reviews");

console.log('Loading routes...');
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
console.log('Routes loaded successfully!');

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "🚀 E-commerce Backend API is running successfully!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    server: {
      port: process.env.PORT || 5000,
      environment: process.env.NODE_ENV || "development"
    },
    api: {
      baseUrl: "/api",
      endpoints: {
        products: {
          url: "/api/products",
          description: "Get all products or specific product by ID",
          methods: ["GET", "POST", "PUT", "DELETE"]
        },
        cart: {
          url: "/api/cart", 
          description: "Manage shopping cart operations",
          methods: ["GET", "POST", "PUT", "DELETE"]
        },
        reviews: {
          url: "/api/reviews",
          description: "Submit and manage product reviews",
          methods: ["GET", "POST"]
        },
        checkout: {
          url: "/api/checkout",
          description: "Create Stripe checkout session",
          methods: ["POST"]
        },
        payment: {
          url: "/api/payment",
          description: "Process payments with Stripe",
          methods: ["POST"]
        }
      }
    },
    documentation: {
      note: "This is a RESTful API for an e-commerce application",
      features: [
        "Product management",
        "Shopping cart functionality", 
        "Stripe payment integration",
        "CORS enabled for frontend integration"
      ]
    }
  });
});

// Test endpoint to verify server accessibility
app.get("/test", (req, res) => {
  console.log('Test endpoint accessed');
  res.json({ 
    message: "Backend server is accessible!",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Payment route (Stripe)
app.post('/api/checkout', async (req, res) => {
  try {
    // Get cart items from the request body
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    // Format items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:8080/success.html',
      cancel_url: 'http://localhost:8080/cancel.html',
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Alternative payment route for compatibility
app.post('/api/payment', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "inr",
      automatic_payment_methods: { enabled: true }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
