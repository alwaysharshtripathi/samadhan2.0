// Import http module
const http = require('http');

// Create server
const server = http.createServer((req, res) => {
  // Set response header
  res.writeHead(200, { 'Content-Type': 'application/json' });

  // Return JSON response
  res.end(JSON.stringify({ message: "Hello, World!" }));
});

// Define port
const PORT = 3000;

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/`);
});
