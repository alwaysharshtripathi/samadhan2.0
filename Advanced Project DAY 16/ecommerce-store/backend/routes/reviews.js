const express = require('express');
const router = express.Router();

// Google Apps Script Web App URL
const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby6aTa4WRIrcpmrdSO1iSyHq53gXtHZgHJvX18__ScbBV85jkV4BaUyUZI1r3SuqTcW/exec';

// Test route to verify the endpoint is working
router.get('/test', (req, res) => {
  res.json({ message: 'Reviews route is working!' });
});

// Test GET route on the same path to check routing
router.get('/submit', (req, res) => {
  res.json({ message: 'GET /submit route is working!' });
});

// Proxy endpoint to forward reviews to Google Sheets
router.post('/submit', async (req, res) => {
  console.log('POST /submit route hit!');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  try {
    const { id, name, email, rating, message, clientId, date, action } = req.body;
    
    // Validate required fields
    if (!name || !rating || !message) {
      return res.status(400).json({ 
        error: 'Name, rating, and message are required' 
      });
    }

    // Prepare data for Google Sheets
    const sheetsData = {
      id: id || '',
      name: name || '',
      email: email || '',
      rating: rating || '',
      message: message || '',
      clientId: clientId || '',
      date: date || new Date().toISOString(),
      action: action || 'create'
    };

    console.log('Forwarding to Google Sheets:', sheetsData);

    // Forward the request to Google Sheets
    const response = await fetch(SHEETS_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sheetsData)
    });

    if (response.ok) {
      const responseText = await response.text();
      console.log('Google Sheets response:', responseText);
      res.json({ 
        success: true, 
        message: 'Review submitted successfully',
        sheetsResponse: responseText
      });
    } else {
      const errorText = await response.text();
      console.error('Google Sheets error:', response.status, errorText);
      res.status(response.status).json({ 
        error: 'Failed to save to Google Sheets',
        details: errorText
      });
    }

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
