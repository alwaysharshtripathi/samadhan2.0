// Frontend configuration
const CONFIG = {
  // Backend API base URL
  API_BASE_URL: 'http://localhost:5000/api',
  
  // Frontend server port
  FRONTEND_PORT: 8080,
  
  // Backend server port
  BACKEND_PORT: 5000,
  
  // CORS origins
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:8080', 
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5000'
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  // Browser environment
  window.CONFIG = CONFIG;
}




