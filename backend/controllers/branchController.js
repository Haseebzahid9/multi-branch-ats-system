const Branch = require('../models/Branch');

const getBranches = async (req, res) => {
  const branches = await Branch.find({ isActive: true }).sort({ branchName: 1 });
  res.json(branches);
};

const createBranch = async (req, res) => {
  const { branchName, location, manager, description } = req.body;
  if (!branchName || !location)
    return res.status(400).json({ message: 'Branch name and location are required' });
  const exists = await Branch.findOne({ branchName });
  if (exists) return res.status(400).json({ message: 'Branch already exists' });
  const branch = await Branch.create({ branchName, location, manager, description });
  res.status(201).json(branch);
};

const updateBranch = async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  Object.assign(branch, req.body);
  const updated = await branch.save();
  res.json(updated);
};

const deleteBranch = async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  branch.isActive = false;
  await branch.save();
  res.json({ message: 'Branch deactivated' });
};

module.exports = { getBranches, createBranch, updateBranch, deleteBranch };
