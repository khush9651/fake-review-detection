import { useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReviewForm from './components/ReviewForm';
import ResultsPanel from './components/ResultsPanel';
import { analyzeReviews } from './services/api';

// Lazy-load the heavy Recharts component so it's code-split into its own chunk
const AnalyticsChart = lazy(() => import('./components/AnalyticsChart'));

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleAnalyze = async (topic, reviews) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeReviews(topic, reviews);
      setResults(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to connect to the analysis server. Is the backend running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />

      <main className="container" style={{ paddingBottom: 60 }}>
        <Hero />

        {/* Error from API */}
        {error && (
          <div className="error-banner" role="alert" style={{ marginBottom: 24 }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading overlay feedback */}
        {loading && (
          <div className="card loading-wrapper" style={{ marginBottom: 24, background: 'rgba(255,255,255,0.75)' }}>
            <div className="spinner" />
            <p className="loading-text">Analyzing reviews with heuristic engine…</p>
          </div>
        )}

        {/* Form */}
        <ReviewForm onSubmit={handleAnalyze} loading={loading} />

        {/* Results */}
        {results && !loading && (
          <>
            <div style={{ height: 32 }} />
            <ResultsPanel data={results} />
            <Suspense fallback={
              <div className="card loading-wrapper">
                <div className="spinner" />
                <p className="loading-text">Loading chart…</p>
              </div>
            }>
              <AnalyticsChart data={results} />
            </Suspense>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          🛡️ ReviewGuard — AI-powered fake review detection &nbsp;|&nbsp; Built with React + Node.js
        </div>
      </footer>
    </div>
  );
}
