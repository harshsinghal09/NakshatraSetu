// User Model - MongoDB Schema
// Users collection ke liye Mongoose schema

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Password ko default query mein exclude karo
  },
  // Premium / Free tier control
  isPremium: {
    type: Boolean,
    default: false
  },
  planType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  // AI usage tracking
  aiUsageCount: {
    type: Number,
    default: 0
  },
  aiLimit: {
    type: Number,
    default: 3 // Free users ke liye 3 AI calls
  },
  // Refresh token for JWT rotation
  refreshToken: {
    type: String,
    select: false
  },
  // Premium activation date
  premiumActivatedAt: {
    type: Date,
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Password hash karo save se pehle
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password compare karo login pe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// AI limit check karo
userSchema.methods.canUseAI = function() {
  if (this.isPremium) return true;
  return this.aiUsageCount < this.aiLimit;
};

// AI usage increment
userSchema.methods.incrementAIUsage = async function() {
  if (!this.isPremium) {
    this.aiUsageCount += 1;
    await this.save();
  }
};

module.exports = mongoose.model('User', userSchema);
