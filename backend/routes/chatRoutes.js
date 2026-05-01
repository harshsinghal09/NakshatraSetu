const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearChatHistory } = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/message', sendMessage);
router.get('/history/:kundaliId', getChatHistory);
router.delete('/history/:kundaliId', clearChatHistory);

module.exports = router;
