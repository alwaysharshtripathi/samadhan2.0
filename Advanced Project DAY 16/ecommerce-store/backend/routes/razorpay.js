const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// Use your Razorpay test keys here
const razorpay = new Razorpay({
    key_id: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your test key id
    key_secret: '1234567890'   // Replace with your test key secret
});

router.post('/order', async (req, res) => {
    const { amount, currency = 'INR' } = req.body;
    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt: 'order_rcptid_' + Math.floor(Math.random() * 10000),
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error('Razorpay order error:', err); // <-- This logs the error
        res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
    }
});

module.exports = router;
