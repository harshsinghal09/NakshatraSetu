const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAIUsage } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/ai-usage', getAIUsage);

module.exports = router;
