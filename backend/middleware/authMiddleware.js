const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      next();
    } catch {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

const hrOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'hr' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: HR/Admin only' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

module.exports = { protect, hrOnly, adminOnly };
