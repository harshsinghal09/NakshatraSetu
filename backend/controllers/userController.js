// User Controller - profile, AI usage stats
const User = require('../models/User');

// GET /api/user/profile
const getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/user/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required.' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated.', user });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/ai-usage
const getAIUsage = async (req, res) => {
  res.json({
    success: true,
    aiUsageCount: req.user.aiUsageCount,
    aiLimit: req.user.aiLimit,
    isPremium: req.user.isPremium,
    remaining: req.user.isPremium ? 'unlimited' : Math.max(0, req.user.aiLimit - req.user.aiUsageCount)
  });
};

module.exports = { getProfile, updateProfile, getAIUsage };
