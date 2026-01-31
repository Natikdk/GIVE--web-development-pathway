require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const lessonController = require('./controllers/lessonController');
const contactController = require('./controllers/contactController');
const adminController = require('./controllers/adminController');

const PORT = process.env.PORT || 5000;


// Connect to database
connectDB();

const server = http.createServer(async (req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Route requests to appropriate controllers
    if (req.url.startsWith('/api/lessons')) {
      await lessonController.handleRoutes(req, res);
    } else if (req.url.startsWith('/api/contact')) {
      await contactController.handleRoutes(req, res);
    } else if (req.url.startsWith('/api/admin')) {
      await adminController.handleRoutes(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`\n🔗 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/lessons`);
  console.log(`   GET  http://localhost:${PORT}/api/lessons/css`);
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log(`\n📡 Waiting for requests...\n`);
});