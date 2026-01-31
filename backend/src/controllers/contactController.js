const Contact = require('../models/Contact');

const contactController = {
  handleRoutes: async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // POST /api/contact - Submit contact form
    if (method === 'POST' && pathname === '/api/contact') {
      return contactController.createContact(req, res);
    }

    // GET /api/contact - Get all contacts (admin use, but keeping for compatibility)
    if (method === 'GET' && pathname === '/api/contact') {
      return contactController.getAllContacts(req, res);
    }

    // Route not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Route not found' }));
  },

  createContact: async (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    
    req.on('end', async () => {
      try {
        const { name, email, subject, message } = JSON.parse(body);

        // Validate required fields
        if (!name || !email || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            message: "Please provide name, email, and message" 
          }));
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            message: "Please provide a valid email address" 
          }));
          return;
        }

        // Save to database
        const contact = new Contact({
          name,
          email,
          subject: subject || '',
          message
        });

        await contact.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: "Thank you for your message! We'll get back to you soon.",
          data: {
            id: contact._id,
            name: contact.name,
            email: contact.email
          }
        }));

      } catch (err) {
        if (err.name === 'SyntaxError') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            message: "Invalid JSON data" 
          }));
        } else {
          console.error('Error saving contact:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            message: "Server error. Please try again later." 
          }));
        }
      }
    });
  },

  getAllContacts: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: contacts.length,
        data: contacts
      }));
    } catch (err) {
      console.error('Error fetching contacts:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        message: "Server error" 
      }));
    }
  }
};

module.exports = contactController;