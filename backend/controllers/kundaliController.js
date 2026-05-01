// Kundali Controller
// Kundali generation, rule engine aur AI explanation handle karta hai

const Kundali = require('../models/Kundali');
const User = require('../models/User');
const { calculateKundali } = require('../services/ephemerisService');
const { applyRuleEngine } = require('../services/ruleEngine');
const { generateKundaliExplanation } = require('../services/geminiService');
const { geocodePlace } = require('../utils/geocoding');
const { generateCacheKey } = require('../utils/cacheUtil');

// POST /api/kundali/generate
const generateKundali = async (req, res, next) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    // Validation
    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Naam, janm tithi, janm samay aur janm sthan required hain.'
      });
    }

    // Geocode the place
    const geoData = await geocodePlace(placeOfBirth);

    // Calculate kundali using ephemeris engine
    const kundaliData = await calculateKundali(
      dateOfBirth,
      timeOfBirth,
      geoData.latitude,
      geoData.longitude,
      geoData.timezone
    );

    // Apply Vedic rule engine to get insights
    const insights = applyRuleEngine(kundaliData.planets, kundaliData.houses, kundaliData.lagna);

    // Generate cache key
    const cacheKey = generateCacheKey(kundaliData.planets, kundaliData.lagna.sign);

    // Check if same kundali already exists for this user
    let existingKundali = await Kundali.findOne({ userId: req.user._id, cacheKey });

    if (existingKundali) {
      return res.json({
        success: true,
        message: 'Kundali already generated hai. Cached version return kar rahe hain.',
        kundali: existingKundali,
        cached: true
      });
    }

    // Save new kundali
    const kundali = await Kundali.create({
      userId: req.user._id,
      name,
      dateOfBirth: new Date(dateOfBirth),
      timeOfBirth,
      placeOfBirth,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      timezone: geoData.timezone,
      lagna: kundaliData.lagna,
      planets: kundaliData.planets,
      houses: kundaliData.houses,
      insights,
      currentMahadasha: kundaliData.currentMahadasha,
      cacheKey
    });

    res.status(201).json({
      success: true,
      message: 'Kundali successfully generate ho gayi! 🪐',
      kundali,
      cached: false
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/kundali/:id/ai-explain
const getAIExplanation = async (req, res, next) => {
  try {
    const kundali = await Kundali.findOne({ _id: req.params.id, userId: req.user._id });

    if (!kundali) {
      return res.status(404).json({ success: false, message: 'Kundali not found.' });
    }

    // Return cached AI explanation if available
    if (kundali.aiExplanation) {
      return res.json({
        success: true,
        explanation: kundali.aiExplanation,
        cached: true
      });
    }

    // Check AI usage limit
    if (!req.user.canUseAI()) {
      return res.status(403).json({
        success: false,
        message: `AI usage limit reached. Free mein ${req.user.aiLimit} AI explanations milte hain. Premium upgrade karein unlimited access ke liye.`,
        aiLimitReached: true
      });
    }

    // Generate AI explanation
    const explanation = await generateKundaliExplanation(
      kundali.insights,
      kundali.lagna,
      kundali.currentMahadasha,
      req.user.name
    );

    // Cache the explanation in DB
    kundali.aiExplanation = explanation;
    kundali.aiExplanationGeneratedAt = new Date();
    await kundali.save();

    // Increment user's AI usage count
    await req.user.incrementAIUsage();

    res.json({
      success: true,
      explanation,
      cached: false,
      aiUsageCount: req.user.aiUsageCount + 1
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/kundali/my-kundalis
const getMyKundalis = async (req, res, next) => {
  try {
    const kundalis = await Kundali.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('name dateOfBirth placeOfBirth lagna createdAt aiExplanation');

    res.json({ success: true, kundalis });
  } catch (error) {
    next(error);
  }
};

// GET /api/kundali/:id
const getKundaliById = async (req, res, next) => {
  try {
    const kundali = await Kundali.findOne({ _id: req.params.id, userId: req.user._id });

    if (!kundali) {
      return res.status(404).json({ success: false, message: 'Kundali not found.' });
    }

    res.json({ success: true, kundali });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/kundali/:id
const deleteKundali = async (req, res, next) => {
  try {
    const kundali = await Kundali.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!kundali) {
      return res.status(404).json({ success: false, message: 'Kundali not found.' });
    }

    res.json({ success: true, message: 'Kundali delete ho gayi.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateKundali, getAIExplanation, getMyKundalis, getKundaliById, deleteKundali };
