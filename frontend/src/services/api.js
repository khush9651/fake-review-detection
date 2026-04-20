import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Analyze reviews for a given topic
 */
export async function analyzeReviews(topic, reviews) {
  try {
    const { data } = await api.post('/reviews/analyze', { topic, reviews });
    return data;
  } catch (error) {
    console.error("Analyze API Error:", error);
    throw error;
  }
}

/**
 * Fetch global stats
 */
export async function fetchStats() {
  try {
    const { data } = await api.get('/reviews/stats');
    return data;
  } catch (error) {
    console.error("Stats API Error:", error);
    throw error;
  }
}

export default api;
