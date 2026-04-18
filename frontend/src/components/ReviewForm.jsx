import { useState, useCallback } from 'react';

// Each review entry carries a stable unique id so React uses it as the key,
// guaranteeing a full DOM remount when entries are replaced (e.g. Load Sample).
let _uid = 0;
const makeEntry = (text = '') => ({ id: ++_uid, text });

const SAMPLE_REVIEWS = [
  'Best ever phone, must buy! You won\'t regret it!!!',
  'Camera is good but battery is average. Decent overall.',
  'Amazing amazing amazing product! Life changing experience!!!',
  'The screen cracked after two weeks of normal use. Very disappointing build quality.',
  'It is a phone.',
];

export default function ReviewForm({ onSubmit, loading }) {
  const [topic, setTopic] = useState('');
  const [reviews, setReviews] = useState(() => [makeEntry(), makeEntry()]);
  const [error, setError] = useState('');

  const addReview = useCallback(() => {
    if (reviews.length >= 20) return;
    setReviews(prev => [...prev, makeEntry()]);
  }, [reviews.length]);

  const removeReview = useCallback((id) => {
    setReviews(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(r => r.id !== id);
    });
  }, []);

  const updateReview = useCallback((id, val) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, text: val } : r));
  }, []);

  // Replace all state atomically — fresh ids guarantee React remounts each row
  const loadSample = useCallback(() => {
    setTopic('Samsung');
    setReviews(SAMPLE_REVIEWS.map(text => makeEntry(text)));
    setError('');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!topic.trim()) {
      setError('Please enter a topic (e.g. "iPhone", "Netflix").');
      return;
    }

    const validReviews = reviews.map(r => r.text.trim()).filter(Boolean);
    if (validReviews.length === 0) {
      setError('Please enter at least one review.');
      return;
    }

    onSubmit(topic.trim(), validReviews);
  };

  const resetForm = useCallback(() => {
    setTopic('');
    setReviews([makeEntry(), makeEntry()]);
    setError('');
  }, []);

  return (
    <form className="card" onSubmit={handleSubmit} noValidate aria-label="Review analysis form">
      {/* Error */}
      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Topic */}
      <div className="form-section">
        <label htmlFor="topic-input" className="form-label">
          <span className="form-label-icon">🏷️</span>
          Product / Service Topic
        </label>
        <input
          id="topic-input"
          type="text"
          className="form-input"
          placeholder='e.g. "iPhone 15", "Netflix", "Nike Air Max"'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          maxLength={100}
          aria-required="true"
        />
      </div>

      {/* Reviews */}
      <div className="form-section">
        <div className="form-label">
          <span className="form-label-icon">💬</span>
          Reviews ({reviews.filter(r => r.text.trim()).length} / {reviews.length})
        </div>

        <div className="reviews-list">
          {reviews.map((entry, idx) => (
            // Use entry.id (not idx) as the key — this forces a clean remount
            // when Load Sample replaces entries, preventing stale DOM values.
            <div className="review-row" key={entry.id}>
              <div className="review-number" aria-hidden="true">
                {idx + 1}
              </div>
              <textarea
                id={`review-input-${entry.id}`}
                className="review-input"
                placeholder={`Enter review #${idx + 1}…`}
                value={entry.text}
                onChange={(e) => updateReview(entry.id, e.target.value)}
                disabled={loading}
                rows={2}
                aria-label={`Review ${idx + 1}`}
              />
              {reviews.length > 1 && (
                <button
                  type="button"
                  className="review-remove-btn"
                  onClick={() => removeReview(entry.id)}
                  disabled={loading}
                  aria-label={`Remove review ${idx + 1}`}
                  title="Remove review"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {reviews.length < 20 && (
          <button
            type="button"
            className="btn btn-add"
            onClick={addReview}
            disabled={loading}
            style={{ marginTop: 10 }}
            id="add-review-btn"
          >
            + Add Another Review
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="btn-actions">
        <button
          id="analyze-btn"
          type="submit"
          className="btn btn-primary btn-analyze"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Analyzing…
            </>
          ) : (
            <>🔍 Analyze Reviews</>
          )}
        </button>

        <button
          id="sample-btn"
          type="button"
          className="btn btn-secondary"
          onClick={loadSample}
          disabled={loading}
        >
          🧪 Load Sample
        </button>

        <button
          id="reset-btn"
          type="button"
          className="btn btn-secondary"
          onClick={resetForm}
          disabled={loading}
        >
          ↺ Reset
        </button>
      </div>
    </form>
  );
}
