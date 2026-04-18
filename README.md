# 🛡️ ReviewGuard — Fake Review Detection System

A full-stack web application that detects fake reviews using AI heuristics.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React + Vite + Recharts             |
| Backend  | Node.js + Express + Sentiment.js    |
| Styling  | Vanilla CSS (custom design system)  |

---

## 📁 Project Structure

```
Fake Review Detection System/
├── backend/
│   ├── app.js                        # Express entry point
│   ├── routes/reviewRoutes.js        # API routes
│   ├── controllers/reviewController.js
│   └── services/fakeDetectionService.js  # Detection logic
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── ReviewForm.jsx
    │   │   ├── ResultsPanel.jsx
    │   │   └── AnalyticsChart.jsx
    │   └── services/api.js
    └── index.html
```

---

## 🚀 Running Locally

### 1. Start Backend

```bash
cd backend
npm install
npm start
# API running at http://localhost:5000
```

### 2. Start Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🔌 API Reference

### `POST /api/reviews/analyze`

**Request:**
```json
{
  "topic": "iphone",
  "reviews": ["Best ever phone, must buy!", "Battery life is decent"]
}
```

**Response:**
```json
{
  "topic": "iphone",
  "total": 2,
  "summary": { "genuine": 1, "suspicious": 0, "fake": 1 },
  "results": [
    {
      "review": "Best ever phone, must buy!",
      "fakeScore": 70,
      "label": "Fake",
      "reasons": ["Spam/promotional keywords detected: \"best ever\", \"must buy\"..."]
    }
  ]
}
```

---

## 🧠 Detection Heuristics

| Signal              | Condition                     | Score Added |
|---------------------|-------------------------------|-------------|
| Topic relevance     | Topic not mentioned           | +20         |
| Positive sentiment  | Sentiment score > 5           | +20         |
| Negative sentiment  | Sentiment score < -5          | +20         |
| Spam keywords       | Per keyword match             | +15 each    |
| Word repetition     | Unique words < 60%            | +15         |
| Short review        | Word count < 5                | +10         |
| Excessive !!!       | 2+ exclamation runs           | +10         |
| ALL CAPS words      | 2+ all-caps words             | +10         |

**Labels:** 0–30 → Genuine | 31–60 → Suspicious | 61–100 → Fake
