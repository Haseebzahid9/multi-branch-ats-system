const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendEmail, shortlistEmailHTML, rejectionEmailHTML } = require('../utils/sendEmail');

// POST /api/applications — candidate
const applyJob = async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) return res.status(400).json({ message: 'Job ID is required' });
  if (!req.files?.resume) return res.status(400).json({ message: 'Resume is required' });

  const job = await Job.findById(jobId);
  if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found or closed' });
  if (new Date(job.deadline) < new Date()) return res.status(400).json({ message: 'Application deadline has passed' });

  const existing = await Application.findOne({ candidateId: req.user._id, jobId });
  if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

  const resumeURL = req.files.resume[0].path;
  const coverLetterURL = req.files.coverLetter ? req.files.coverLetter[0].path : '';

  const application = await Application.create({
    candidateId: req.user._id,
    jobId,
    resumeURL,
    coverLetterURL,
    status: 'Submitted',
  });

  res.status(201).json({ message: 'Application submitted successfully', application });
};

// GET /api/applications/my — candidate's own applications
const getMyApplications = async (req, res) => {
  const apps = await Application.find({ candidateId: req.user._id })
    .populate('jobId', 'title department branch deadline jobType')
    .sort({ appliedDate: -1 });
  res.json(apps);
};

// GET /api/applications — HR/Admin: all applications
const getAllApplications = async (req, res) => {
  const { jobId, status } = req.query;
  const filter = {};
  if (jobId) filter.jobId = jobId;
  if (status) filter.status = status;
  const apps = await Application.find(filter)
    .populate('candidateId', 'name email phone cnic branch')
    .populate('jobId', 'title department branch')
    .sort({ appliedDate: -1 });
  res.json(apps);
};

// PUT /api/applications/:id/status — HR/Admin
const updateStatus = async (req, res) => {
  const { status, hrNotes } = req.body;
  const app = await Application.findById(req.params.id)
    .populate('candidateId', 'name email')
    .populate('jobId', 'title branch');
  if (!app) return res.status(404).json({ message: 'Application not found' });

  app.status = status;
  if (hrNotes) app.hrNotes = hrNotes;
  await app.save();

  // Send emails
  try {
    if (status === 'Shortlisted') {
      await sendEmail({
        to: app.candidateId.email,
        subject: `Congratulations! Shortlisted for ${app.jobId.title}`,
        html: shortlistEmailHTML(app.candidateId.name, app.jobId.title, app.jobId.branch),
      });
    } else if (status === 'Rejected') {
      await sendEmail({
        to: app.candidateId.email,
        subject: `Application Update: ${app.jobId.title}`,
        html: rejectionEmailHTML(app.candidateId.name, app.jobId.title),
      });
    }
  } catch (err) {
    console.error('Email send error:', err.message);
  }

  res.json({ message: 'Status updated', application: app });
};

// GET /api/applications/stats — HR/Admin
const getAppStats = async (req, res) => {
  const total = await Application.countDocuments();
  const byStatus = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  res.json({ total, byStatus });
};

module.exports = { applyJob, getMyApplications, getAllApplications, updateStatus, getAppStats };
