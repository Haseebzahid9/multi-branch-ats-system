const Job = require('../models/Job');

// GET /api/jobs — public
const getJobs = async (req, res) => {
  const { branch, department, search, active } = req.query;
  const filter = {};
  if (active !== 'false') filter.isActive = true;
  if (branch) filter.branch = branch;
  if (department) filter.department = new RegExp(department, 'i');
  if (search) filter.$or = [
    { title: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') },
    { department: new RegExp(search, 'i') },
  ];
  const jobs = await Job.find(filter).populate('postedBy', 'name email').sort({ createdAt: -1 });
  res.json(jobs);
};

// GET /api/jobs/:id — public
const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
};

// POST /api/jobs — HR/Admin
const createJob = async (req, res) => {
  const { title, description, department, branch, seats, requirements, qualifications, salary, jobType, deadline } = req.body;
  if (!title || !description || !department || !branch || !seats || !requirements || !deadline)
    return res.status(400).json({ message: 'All required fields must be provided' });
  const job = await Job.create({
    title, description, department, branch, seats, requirements,
    qualifications, salary, jobType, deadline,
    postedBy: req.user._id,
  });
  res.status(201).json(job);
};

// PUT /api/jobs/:id — HR/Admin
const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  Object.assign(job, req.body);
  const updated = await job.save();
  res.json(updated);
};

// DELETE /api/jobs/:id — HR/Admin
const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  job.isActive = false;
  await job.save();
  res.json({ message: 'Job deactivated' });
};

// GET /api/jobs/stats — admin dashboard stats
const getJobStats = async (req, res) => {
  const total = await Job.countDocuments({ isActive: true });
  const byBranch = await Job.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$branch', count: { $sum: 1 } } },
  ]);
  res.json({ totalActiveJobs: total, byBranch });
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getJobStats };
