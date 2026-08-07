# Anti Gravity — AI Emergency Healthcare Platform

## 🏥 Overview

**Anti Gravity** is a production-ready, AI-powered emergency healthcare platform. It helps users find nearby hospitals, book doctors, request ambulances, check blood availability, track ICU beds, and get AI health guidance — all from one beautiful dashboard.

## ✨ Features

- 🏥 **Hospital Finder** — Find nearby hospitals with real-time bed availability
- 🤖 **AI Recommendation** — AI scores hospitals based on your condition & urgency
- 🚑 **Ambulance Booking** — Request & track ambulances in real-time
- 👨‍⚕️ **Doctor Search** — Find specialists and book appointments
- 🛏️ **Bed & ICU Availability** — Real-time bed tracking across hospitals
- 🩸 **Blood Bank** — Find blood availability by type
- 📅 **Appointments** — Manage all medical appointments
- 🤖 **AI Health Assistant** — Symptom checker with AI guidance
- 🆘 **Emergency SOS** — One-tap emergency access

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router v6 |
| Auth | Firebase Authentication (Mock mode available) |
| Notifications | React Hot Toast |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (optional, runs on mock data) |

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo credentials:**
- Email: `demo@antigravity.health`
- Password: `demo123`

### Backend (optional)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs on [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # Sidebar, TopBar, DashboardLayout
│   │   │   └── ui/         # Reusable UI components
│   │   ├── context/        # AuthContext, AppContext
│   │   ├── data/           # mockData.js (demo data)
│   │   ├── pages/          # All 13 pages
│   │   └── services/       # firebase.js, api.js
│   └── vite.config.js
├── backend/
│   ├── main.py             # FastAPI app
│   └── requirements.txt
└── README.md
```

## 🎨 Design System

- **Primary**: Blue (#0e64ff)
- **Secondary**: Teal (#0bbcb8)
- **Accent**: Purple (#7c3aed)
- **Dark Mode**: Supported via CSS variables
- **Font**: Inter + Outfit (Google Fonts)
- **Effects**: Glassmorphism, gradients, subtle shadows

## 🔐 Authentication

The app uses Firebase Authentication in **demo mode** by default — no Firebase project needed.

To use real Firebase auth:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password and Google authentication
3. Update `src/services/firebase.js` with your config

## 📜 License

MIT License — Built for the Anti Gravity Healthcare Hackathon
