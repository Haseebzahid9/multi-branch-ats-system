const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, phone, cnic, branch } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, phone, cnic, branch, role: 'candidate' });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
    token: generateToken(user._id),
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  if (!user.isActive)
    return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
    phone: user.phone,
    cnic: user.cnic,
    token: generateToken(user._id),
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, cnic, branch } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (cnic) user.cnic = cnic;
  if (branch) user.branch = branch;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    branch: updated.branch,
    phone: updated.phone,
    token: generateToken(updated._id),
  });
};

// GET /api/auth/users — admin only
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// PUT /api/auth/users/:id/role — admin only
const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
  await user.save();
  res.json({ message: 'User updated', user });
};

module.exports = { register, login, getMe, updateProfile, getAllUsers, updateUserRole };
