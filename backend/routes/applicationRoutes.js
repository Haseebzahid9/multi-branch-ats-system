const express = require('express');
const router = express.Router();
const { applyJob, getMyApplications, getAllApplications, updateStatus, getAppStats } = require('../controllers/applicationController');
const { protect, hrOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const uploadFields = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]);

router.post('/', protect, uploadFields, applyJob);
router.get('/my', protect, getMyApplications);
router.get('/stats', protect, hrOnly, getAppStats);
router.get('/', protect, hrOnly, getAllApplications);
router.put('/:id/status', protect, hrOnly, updateStatus);

module.exports = router;
