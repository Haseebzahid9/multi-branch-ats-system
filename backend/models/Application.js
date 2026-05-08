const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  resumeURL: { type: String, required: true },
  coverLetterURL: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'],
    default: 'Submitted',
  },
  appliedDate: { type: Date, default: Date.now },
  hrNotes: { type: String, default: '' },
}, { timestamps: true });

// Prevent duplicate application
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
