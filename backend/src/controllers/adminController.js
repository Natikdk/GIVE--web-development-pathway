const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Lesson = require('../models/Lesson');

const adminController = {
  handleRoutes: async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // POST /api/admin/login
    if (method === 'POST' && pathname === '/api/admin/login') {
      return adminController.login(req, res);
    }

    // Check auth for all other routes
    const authResult = await adminController.verifyToken(req);
    if (!authResult.success && !pathname.includes('/login')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
      return;
    }

    // Routes with authentication
   if (method === 'GET' && pathname === '/api/admin/profile') return adminController.getProfile(req, res, authResult.adminId);
    if (method === 'GET' && pathname === '/api/admin/dashboard/stats') return adminController.getDashboardStats(req, res);
    if (method === 'GET' && pathname === '/api/admin/lessons') return adminController.getAllLessons(req, res);
    if (method === 'POST' && pathname === '/api/admin/lessons') return adminController.createLesson(req, res);
    if (method === 'GET' && pathname.startsWith('/api/admin/contacts')) return adminController.getContacts(req, res, parsedUrl);
    if (method === 'GET' && pathname.match(/^\/api\/admin\/contacts\/[^/]+$/)) return adminController.getContact(req, res);
    if (method === 'PATCH' && pathname.match(/^\/api\/admin\/contacts\/[^/]+$/)) return adminController.updateContact(req, res);
    if (method === 'PUT' && pathname.match(/^\/api\/admin\/lessons\/[^/]+$/)) return adminController.updateLesson(req, res);
    if (method === 'DELETE' && pathname.match(/^\/api\/admin\/lessons\/[^/]+$/)) return adminController.deleteLesson(req, res);

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Route not found' }));
  },

  login: async (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
          return;
        }
        admin.lastLogin = new Date();
        await admin.save();
        const token = jwt.sign(
          { adminId: admin._id, email: admin.email, role: admin.role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Login successful',
          token,
          admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role }
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
      }
    });
  },

  getProfile: async (req, res, adminId) => {
    try {
      const admin = await Admin.findById(adminId).select('-password');
      if (!admin) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Admin not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, admin }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
  },

  verifyToken: async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return { success: false };
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return { success: true, adminId: decoded.adminId };
    } catch (error) {
      return { success: false };
    }
  },


  getDashboardStats: async (req, res) => {
    try {
      const [totalLessons, totalContacts, newContacts, repliedContacts] = await Promise.all([
        Lesson.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'new' }),
        Contact.countDocuments({ status: 'replied' })
      ]);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        stats: { totalLessons, totalContacts, newContacts, repliedContacts }
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
  },

  getContacts: async (req, res, parsedUrl) => {
    try {
      const params = parsedUrl.searchParams;
      const status = params.get('status');
      const page = parseInt(params.get('page')) || 1;
      const limit = parseInt(params.get('limit')) || 20;
      const search = params.get('search');
      
      const query = {};
      if (status && status !== 'all') query.status = status;
      if (search) query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
      
      const skip = (page - 1) * limit;
      const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await Contact.countDocuments(query);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        contacts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
  },

  getContact: async (req, res) => {
    try {
      const id = req.url.split('/')[4];
      const contact = await Contact.findById(id);
      if (!contact) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Contact not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, contact }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
  },

  updateContact: async (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const id = req.url.split('/')[4];
        const { status, adminNotes } = JSON.parse(body);
        const updateData = {};
        if (status) {
          updateData.status = status;
          if (status === 'replied') updateData.repliedAt = new Date();
        }
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        
        const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
        if (!contact) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Contact not found' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Contact updated', contact }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
      }
    });
  },

  getAllLessons: async (req, res) => {
    try {
      const lessons = await Lesson.find().sort({ createdAt: -1 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, lessons }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
  },

  createLesson: async (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const { topic, slug, sections } = JSON.parse(body);
        const existingLesson = await Lesson.findOne({ slug });
        if (existingLesson) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Slug already exists' }));
          return;
        }
        const lesson = new Lesson({ topic, slug, sections });
        await lesson.save();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Lesson created', lesson }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
      }
    });
  },

  updateLesson: async (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const id = req.url.split('/')[4];
        const { topic, slug, sections } = JSON.parse(body);
        if (slug) {
          const existingLesson = await Lesson.findOne({ slug, _id: { $ne: id } });
          if (existingLesson) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Slug already exists' }));
            return;
          }
        }
        const lesson = await Lesson.findByIdAndUpdate(id, { topic, slug, sections }, { new: true });
        if (!lesson) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Lesson not found' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Lesson updated', lesson }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
      }
    });
  },

  deleteLesson: async (req, res) => {
    try {
      const id = req.url.split('/')[4];
      const lesson = await Lesson.findByIdAndDelete(id);
      if (!lesson) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Lesson not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Lesson deleted' }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
  }
};

module.exports = adminController;