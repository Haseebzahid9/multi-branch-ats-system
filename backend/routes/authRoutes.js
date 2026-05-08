const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;
