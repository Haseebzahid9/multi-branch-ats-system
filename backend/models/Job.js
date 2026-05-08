const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  department: { type: String, required: true, trim: true },
  branch: {
    type: String,
    required: true,
    enum: ['Islamabad', 'Lahore', 'Karachi', 'Remote'],
  },
  seats: { type: Number, required: true, min: 1 },
  requirements: { type: String, required: true },
  qualifications: { type: String, default: '' },
  salary: { type: String, default: 'Market Competitive' },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  deadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
