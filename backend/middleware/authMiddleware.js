// Authentication Middleware
// Protected routes ke liye JWT verify karta hai

const { verifyAccessToken } = require('../utils/jwtHelper');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Please login again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Premium features ke liye middleware
const premiumMiddleware = (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a Premium subscription.',
      requiresPremium: true
    });
  }
  next();
};

// AI usage check middleware
const aiLimitMiddleware = (req, res, next) => {
  if (!req.user.canUseAI()) {
    return res.status(403).json({
      success: false,
      message: `AI usage limit reached. Free users get ${req.user.aiLimit} AI explanations. Upgrade to Premium for unlimited access.`,
      aiLimitReached: true,
      aiUsageCount: req.user.aiUsageCount,
      aiLimit: req.user.aiLimit
    });
  }
  next();
};

module.exports = { authMiddleware, premiumMiddleware, aiLimitMiddleware };
