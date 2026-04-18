const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// POST /api/reviews/analyze - Analyze reviews for fake detection
router.post('/analyze', reviewController.analyzeReviews);

// GET /api/reviews/stats - Get analysis statistics
router.get('/stats', reviewController.getStats);

module.exports = router;
