# 🌟 NakshatraSetu — AI Kundali Analyzer

A full-stack MERN application for AI-powered Vedic astrology Kundali generation with Gemini AI explanations in Hinglish.

## 🏗️ Architecture

```
User Input → Geocoding → Swiss Ephemeris → Vedic Rule Engine → Gemini AI (Hinglish)
```

- **Swiss Ephemeris** (pure JS): Precise planetary positions with Lahiri ayanamsa
- **Vedic Rule Engine**: 30+ deterministic rules for career, relationship, wealth, health, personality
- **Gemini AI**: Only explains already-computed insights in friendly Hinglish — no hallucinated predictions
- **Freemium**: 3 free AI explanations → ₹499 lifetime Premium (Razorpay)

---

## 🚀 Setup

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your keys:

| Variable | Where to get |
|---|---|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) — free cluster |
| `JWT_SECRET` | Any long random string |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) — free |
| `RAZORPAY_KEY_ID` | [Razorpay Dashboard](https://dashboard.razorpay.com) — test keys |
| `RAZORPAY_KEY_SECRET` | Same dashboard |

### 3. Run

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 🔑 Features

| Feature | Free | Premium |
|---|---|---|
| Kundali generation | ✅ | ✅ |
| Planetary chart | ✅ | ✅ |
| Vedic insights | ✅ | ✅ |
| AI explanations | 3x | Unlimited |
| AI Chat | ❌ | ✅ |
| Deep reports | ❌ | ✅ |

---

## 📁 Project Structure

```
nakshatra-setu/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Core logic
│   │   ├── ephemerisService.js  # Swiss Ephemeris (pure JS)
│   │   ├── ruleEngine.js        # Vedic rules
│   │   └── geminiService.js     # AI integration
│   ├── utils/           # JWT, geocoding, cache
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```

---

## 🔒 Tech Stack

- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt
- **Frontend**: React 18, Vite, React Router v6, Axios
- **AI**: Google Gemini 1.5 Flash
- **Payments**: Razorpay
- **Astrology**: Pure JS Swiss Ephemeris with Lahiri ayanamsa
