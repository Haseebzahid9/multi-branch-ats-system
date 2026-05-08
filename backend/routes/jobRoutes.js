const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob, getJobStats } = require('../controllers/jobController');
const { protect, hrOnly } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/stats', protect, hrOnly, getJobStats);
router.get('/:id', getJobById);
router.post('/', protect, hrOnly, createJob);
router.put('/:id', protect, hrOnly, updateJob);
router.delete('/:id', protect, hrOnly, deleteJob);

module.exports = router;
