import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Analyze reviews for a given topic
 * @param {string} topic
 * @param {string[]} reviews
 */
export async function analyzeReviews(topic, reviews) {
  const { data } = await api.post('/reviews/analyze', { topic, reviews });
  return data;
}

/**
 * Fetch global stats
 */
export async function fetchStats() {
  const { data } = await api.get('/reviews/stats');
  return data;
}

export default api;
