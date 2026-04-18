const Sentiment = require('sentiment');
const sentimentAnalyzer = new Sentiment();

// ─────────────────────────────────────────────
// Spam / promotional keyword patterns
// ─────────────────────────────────────────────
const SPAM_KEYWORDS = [
  'best ever',
  'must buy',
  '100% genuine',
  'guaranteed',
  'life changing',
  'life-changing',
  'amazing deal',
  'buy now',
  'limited offer',
  'number one',
  'number 1',
  'unbelievable',
  'mind blowing',
  'mind-blowing',
  'dont miss',
  "don't miss",
  'once in a lifetime',
  'act now',
  'totally worth',
  'you wont regret',
  "you won't regret",
  'blown away',
  'changed my life',
  'five stars',
  '5 stars',
  'perfect product',
  'flawless',
  'zero complaints',
];

// ─────────────────────────────────────────────
// Excessive punctuation / emoji patterns
// ─────────────────────────────────────────────
const EXCESSIVE_PUNCTUATION_REGEX = /[!?]{2,}/g;
const ALL_CAPS_REGEX = /\b[A-Z]{4,}\b/g;

/**
 * Main analysis function
 * @param {string} topic  - Product/service name (lowercase)
 * @param {string} review - The review text
 * @returns {{ review, fakeScore, label, reasons }}
 */
function analyzeReview(topic, review) {
  let score = 0;
  const reasons = [];

  // ── 1. Empty / very empty review ──────────────────────────────────────
  if (!review || review.trim() === '') {
    return {
      review,
      fakeScore: 100,
      label: 'Fake',
      reasons: ['Review is empty.'],
    };
  }

  const lowerReview = review.toLowerCase();
  const words = review.trim().split(/\s+/);
  const wordCount = words.length;

  // ── 2. Topic Relevance (+20) ──────────────────────────────────────────
  const topicWords = topic.split(/\s+/);
  const topicMentioned = topicWords.some((tw) =>
    lowerReview.includes(tw.toLowerCase())
  );
  if (!topicMentioned) {
    score += 20;
    reasons.push(`Topic "${topic}" not mentioned in review (+20 pts)`);
  }

  // ── 3. Sentiment Analysis (+20) ───────────────────────────────────────
  const sentimentResult = sentimentAnalyzer.analyze(review);
  const sentimentScore = sentimentResult.score;

  if (sentimentScore > 5) {
    score += 20;
    reasons.push(
      `Overly positive sentiment (score: ${sentimentScore}) — may be promotional (+20 pts)`
    );
  } else if (sentimentScore < -5) {
    score += 20;
    reasons.push(
      `Extremely negative sentiment (score: ${sentimentScore}) — may be targeted attack (+20 pts)`
    );
  }

  // ── 4. Spam Keywords (+15 each, capped at 45) ─────────────────────────
  const foundSpam = [];
  SPAM_KEYWORDS.forEach((kw) => {
    if (lowerReview.includes(kw)) foundSpam.push(kw);
  });

  if (foundSpam.length > 0) {
    const spamAddition = Math.min(foundSpam.length * 15, 45);
    score += spamAddition;
    reasons.push(
      `Spam/promotional keywords detected: "${foundSpam.join('", "')}" (+${spamAddition} pts)`
    );
  }

  // ── 5. Repetition Detection (+15) ─────────────────────────────────────
  if (wordCount >= 4) {
    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, '')));
    const uniqueRatio = uniqueWords.size / wordCount;
    if (uniqueRatio < 0.6) {
      score += 15;
      reasons.push(
        `High word repetition detected (${Math.round(uniqueRatio * 100)}% unique words) (+15 pts)`
      );
    }
  }

  // ── 6. Short Review (+10) ─────────────────────────────────────────────
  if (wordCount < 5) {
    score += 10;
    reasons.push(`Review is very short (${wordCount} word${wordCount === 1 ? '' : 's'}) (+10 pts)`);
  }

  // ── 7. Excessive punctuation (+10) ────────────────────────────────────
  const excessivePunctMatches = review.match(EXCESSIVE_PUNCTUATION_REGEX);
  if (excessivePunctMatches && excessivePunctMatches.length >= 2) {
    score += 10;
    reasons.push(`Excessive punctuation detected (e.g. "!!!", "???") (+10 pts)`);
  }

  // ── 8. Excessive ALL CAPS words (+10) ────────────────────────────────
  const allCapsMatches = review.match(ALL_CAPS_REGEX);
  if (allCapsMatches && allCapsMatches.length >= 2) {
    score += 10;
    reasons.push(`Multiple ALL-CAPS words detected (+10 pts)`);
  }

  // ── 9. Normalize score ────────────────────────────────────────────────
  const fakeScore = Math.min(score, 100);

  // ── 10. Label assignment ──────────────────────────────────────────────
  let label;
  if (fakeScore <= 30) label = 'Genuine';
  else if (fakeScore <= 60) label = 'Suspicious';
  else label = 'Fake';

  // Provide positive feedback for clean reviews
  if (reasons.length === 0) {
    reasons.push('No suspicious patterns detected. Review appears authentic.');
  }

  return {
    review,
    fakeScore,
    label,
    reasons,
  };
}

module.exports = { analyzeReview };
