const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
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
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  interviewDate: { type: Date, required: true },
  interviewTime: { type: String, required: true },
  location: { type: String, default: 'Online (Google Meet)' },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
