const express = require('express');
const router = express.Router();
const { getBranches, createBranch, updateBranch, deleteBranch } = require('../controllers/branchController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getBranches);
router.post('/', protect, adminOnly, createBranch);
router.put('/:id', protect, adminOnly, updateBranch);
router.delete('/:id', protect, adminOnly, deleteBranch);

module.exports = router;
