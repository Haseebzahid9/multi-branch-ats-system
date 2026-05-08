const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { sendEmail, interviewEmailHTML } = require('../utils/sendEmail');

// POST /api/interviews — HR/Admin
const scheduleInterview = async (req, res) => {
  const { candidateId, jobId, applicationId, interviewDate, interviewTime, location, message } = req.body;
  if (!candidateId || !jobId || !applicationId || !interviewDate || !interviewTime)
    return res.status(400).json({ message: 'Missing required fields' });

  const interview = await Interview.create({
    candidateId, jobId, applicationId, interviewDate, interviewTime,
    location: location || 'Online (Google Meet)', message,
    scheduledBy: req.user._id,
  });

  // Update application status
  await Application.findByIdAndUpdate(applicationId, { status: 'Interview Scheduled' });

  // Populate for email
  const populated = await Interview.findById(interview._id)
    .populate('candidateId', 'name email')
    .populate('jobId', 'title');

  try {
    await sendEmail({
      to: populated.candidateId.email,
      subject: `Interview Scheduled: ${populated.jobId.title}`,
      html: interviewEmailHTML(
        populated.candidateId.name,
        populated.jobId.title,
        interviewDate,
        interviewTime,
        location || 'Online (Google Meet)',
        message
      ),
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }

  res.status(201).json({ message: 'Interview scheduled & email sent', interview });
};

// GET /api/interviews — HR/Admin: all
const getAllInterviews = async (req, res) => {
  const interviews = await Interview.find()
    .populate('candidateId', 'name email phone')
    .populate('jobId', 'title branch department')
    .sort({ interviewDate: 1 });
  res.json(interviews);
};

// GET /api/interviews/my — candidate: own
const getMyInterviews = async (req, res) => {
  const interviews = await Interview.find({ candidateId: req.user._id })
    .populate('jobId', 'title branch department')
    .sort({ interviewDate: 1 });
  res.json(interviews);
};

// PUT /api/interviews/:id — HR/Admin: update
const updateInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) return res.status(404).json({ message: 'Interview not found' });
  Object.assign(interview, req.body);
  const updated = await interview.save();
  res.json(updated);
};

module.exports = { scheduleInterview, getAllInterviews, getMyInterviews, updateInterview };
