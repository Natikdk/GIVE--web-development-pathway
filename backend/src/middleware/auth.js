const jwt = require('jsonwebtoken');

const auth = {
  verifyToken: async (req) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return { success: false, message: 'No token provided' };
      
      const token = authHeader.replace('Bearer ', '');
      if (!token) return { success: false, message: 'No token provided' };
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return { success: true, adminId: decoded.adminId };
    } catch (error) {
      return { success: false, message: 'Please authenticate' };
    }
  }
};

module.exports = auth;