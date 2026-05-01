// Chat Controller
// Kundali-aware AI chatbot

const ChatHistory = require('../models/ChatHistory');
const Kundali = require('../models/Kundali');
const { generateChatResponse } = require('../services/geminiService');

// POST /api/chat/message
const sendMessage = async (req, res, next) => {
  try {
    const { message, kundaliId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message empty hai.' });
    }
    if (!kundaliId) {
      return res.status(400).json({ success: false, message: 'KundaliId required hai.' });
    }

    // Premium check
    if (!req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'AI Chat sirf Premium users ke liye available hai.',
        requiresPremium: true
      });
    }

    // Fetch kundali
    const kundali = await Kundali.findOne({ _id: kundaliId, userId: req.user._id });
    if (!kundali) {
      return res.status(404).json({ success: false, message: 'Kundali not found.' });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ userId: req.user._id, kundaliId });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        kundaliId,
        messages: [],
        title: `${kundali.name} ki Kundali Chat`
      });
    }

    // Add user message
    chatHistory.messages.push({ role: 'user', content: message });

    // Generate AI response
    const aiResponse = await generateChatResponse(
      message,
      kundali.insights,
      kundali.lagna,
      chatHistory.messages.slice(-10)
    );

    // Add AI response
    chatHistory.messages.push({ role: 'assistant', content: aiResponse });

    // Keep last 50 messages only
    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50);
    }

    await chatHistory.save();

    res.json({
      success: true,
      message: aiResponse,
      chatId: chatHistory._id
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/history/:kundaliId
const getChatHistory = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({ success: false, message: 'Premium feature hai.', requiresPremium: true });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      kundaliId: req.params.kundaliId
    });

    res.json({ success: true, messages: chatHistory?.messages || [] });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/chat/history/:kundaliId
const clearChatHistory = async (req, res, next) => {
  try {
    await ChatHistory.findOneAndDelete({ userId: req.user._id, kundaliId: req.params.kundaliId });
    res.json({ success: true, message: 'Chat history cleared.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getChatHistory, clearChatHistory };
