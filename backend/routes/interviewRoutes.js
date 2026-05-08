const express = require('express');
const router = express.Router();
const { scheduleInterview, getAllInterviews, getMyInterviews, updateInterview } = require('../controllers/interviewController');
const { protect, hrOnly } = require('../middleware/authMiddleware');

router.post('/', protect, hrOnly, scheduleInterview);
router.get('/', protect, hrOnly, getAllInterviews);
router.get('/my', protect, getMyInterviews);
router.put('/:id', protect, hrOnly, updateInterview);

module.exports = router;
