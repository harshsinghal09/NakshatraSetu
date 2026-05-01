const express = require('express');
const router = express.Router();
const { generateKundali, getAIExplanation, getMyKundalis, getKundaliById, deleteKundali } = require('../controllers/kundaliController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/generate', generateKundali);
router.get('/my-kundalis', getMyKundalis);
router.get('/:id', getKundaliById);
router.delete('/:id', deleteKundali);
router.post('/:id/ai-explain', getAIExplanation);

module.exports = router;
