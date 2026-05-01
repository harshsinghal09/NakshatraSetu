// Kundali Model - MongoDB Schema
// Kundali data store karne ke liye

const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  name: String,
  longitude: Number,
  sign: String,
  signIndex: Number,
  house: Number,
  isRetrograde: Boolean,
  nakshatra: String,
  nakshatraLord: String,
  degree: Number
}, { _id: false });

const insightSchema = new mongoose.Schema({
  prediction: String,
  based_on: String,
  reason: String,
  rule: String,
  effect: String
}, { _id: false });

const kundaliSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // User input data
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  timeOfBirth: { type: String, required: true }, // HH:MM format
  placeOfBirth: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timezone: { type: Number, default: 5.5 }, // IST default

  // Calculated data from Swiss Ephemeris
  lagna: {
    sign: String,
    signIndex: Number,
    degree: Number,
    lord: String
  },
  planets: [planetSchema],
  houses: [{
    number: Number,
    sign: String,
    signIndex: Number,
    degree: Number,
    lord: String
  }],

  // Rule engine insights - structured output
  insights: {
    career: [insightSchema],
    relationship: [insightSchema],
    personality: [insightSchema],
    health: [insightSchema],
    wealth: [insightSchema]
  },

  // AI generated explanation (cached)
  aiExplanation: {
    type: String,
    default: null
  },
  aiExplanationGeneratedAt: {
    type: Date,
    default: null
  },

  // Dasha system
  currentMahadasha: {
    planet: String,
    startDate: Date,
    endDate: Date
  },

  // Cache key for AI deduplication
  cacheKey: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

// Index for fast user queries
kundaliSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Kundali', kundaliSchema);
