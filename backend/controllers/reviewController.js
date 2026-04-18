const fakeDetectionService = require('../services/fakeDetectionService');

// In-memory stats (replace with DB in production)
let stats = {
  totalAnalyzed: 0,
  genuineCount: 0,
  suspiciousCount: 0,
  fakeCount: 0,
};

/**
 * POST /api/reviews/analyze
 * Analyzes a list of reviews for authenticity
 */
const analyzeReviews = (req, res) => {
  try {
    const { topic, reviews } = req.body;

    // Validation
    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'A valid "topic" string is required.',
      });
    }

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: '"reviews" must be a non-empty array of strings.',
      });
    }

    if (reviews.length > 50) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Maximum 50 reviews per request.',
      });
    }

    const cleanTopic = topic.trim().toLowerCase();
    const results = reviews.map((review) => {
      const cleanReview = typeof review === 'string' ? review.trim() : String(review).trim();
      return fakeDetectionService.analyzeReview(cleanTopic, cleanReview);
    });

    // Update in-memory stats
    stats.totalAnalyzed += results.length;
    results.forEach(({ label }) => {
      if (label === 'Genuine') stats.genuineCount++;
      else if (label === 'Suspicious') stats.suspiciousCount++;
      else if (label === 'Fake') stats.fakeCount++;
    });

    return res.status(200).json({
      topic: topic.trim(),
      total: results.length,
      summary: {
        genuine: results.filter((r) => r.label === 'Genuine').length,
        suspicious: results.filter((r) => r.label === 'Suspicious').length,
        fake: results.filter((r) => r.label === 'Fake').length,
      },
      results,
    });
  } catch (error) {
    console.error('Error in analyzeReviews:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
    });
  }
};

/**
 * GET /api/reviews/stats
 * Returns overall statistics
 */
const getStats = (req, res) => {
  return res.status(200).json(stats);
};

module.exports = { analyzeReviews, getStats };
