import { useEffect, useRef } from 'react';

const LABEL_ICONS = {
  Genuine: '✅',
  Suspicious: '⚠️',
  Fake: '🚫',
};

function ResultCard({ result, index }) {
  const labelClass = result.label.toLowerCase();

  // Stagger animation delay
  const style = { animationDelay: `${index * 80}ms` };

  return (
    <article
      className={`result-card ${labelClass}`}
      style={style}
      aria-label={`Review ${index + 1}: ${result.label}`}
    >
      {/* Header */}
      <div className="result-card-header">
        <p className="result-review-text">{result.review}</p>
        <div className={`result-label-badge ${labelClass}`} aria-label={`Label: ${result.label}`}>
          {LABEL_ICONS[result.label]} {result.label}
        </div>
      </div>

      {/* Score bar */}
      <div className="score-section">
        <div className="score-row">
          <span className="score-label">Fake Score</span>
          <span className="score-value">{result.fakeScore}/100</span>
        </div>
        <div className="score-bar" role="progressbar" aria-valuenow={result.fakeScore} aria-valuemin={0} aria-valuemax={100}>
          <div className="score-fill" style={{ width: `${result.fakeScore}%` }} />
        </div>
      </div>

      {/* Reasons */}
      {result.reasons && result.reasons.length > 0 && (
        <div>
          <div className="reasons-label">Detection Signals</div>
          <ul className="reasons-list">
            {result.reasons.map((reason, i) => (
              <li key={i}>
                <span className="reason-bullet" aria-hidden="true">▶</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function ResultsPanel({ data }) {
  const panelRef = useRef(null);

  // Auto-scroll to results
  useEffect(() => {
    if (data && panelRef.current) {
      setTimeout(() => {
        panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="card empty-state" role="region" aria-label="Results area">
        <div className="empty-icon" aria-hidden="true">🔍</div>
        <div className="empty-title">No Analysis Yet</div>
        <div className="empty-desc">
          Fill in a topic and reviews above, then click <strong>Analyze Reviews</strong>.
        </div>
      </div>
    );
  }

  const { topic, total, summary, results } = data;

  return (
    <section ref={panelRef} role="region" aria-live="polite" aria-label="Analysis results">
      {/* Summary bar */}
      <div className="summary-bar" aria-label="Summary statistics">
        <div className="summary-stat genuine" aria-label={`${summary.genuine} genuine`}>
          <span className="summary-count">{summary.genuine}</span>
          <span className="summary-label">✅ Genuine</span>
        </div>
        <div className="summary-stat suspicious" aria-label={`${summary.suspicious} suspicious`}>
          <span className="summary-count">{summary.suspicious}</span>
          <span className="summary-label">⚠️ Suspicious</span>
        </div>
        <div className="summary-stat fake" aria-label={`${summary.fake} fake`}>
          <span className="summary-count">{summary.fake}</span>
          <span className="summary-label">🚫 Fake</span>
        </div>
      </div>

      {/* Results list */}
      <div className="card">
        <div className="results-header">
          <h2 className="results-title">
            Results for <em style={{ fontStyle: 'italic', color: 'var(--accent-purple-light)' }}>"{topic}"</em>
          </h2>
          <span className="results-count">{total} review{total !== 1 ? 's' : ''}</span>
        </div>

        <div className="results-grid">
          {results.map((result, idx) => (
            <ResultCard key={idx} result={result} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
