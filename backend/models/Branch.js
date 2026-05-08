const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true, unique: true, trim: true },
  location: { type: String, required: true },
  manager: { type: String, trim: true, default: '' },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
