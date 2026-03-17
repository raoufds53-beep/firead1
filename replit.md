# FiReAd — Finance Resilience Advisor

AI-powered climate-finance platform that transforms weather predictions into automatic financial protection for vulnerable families and small businesses.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript (tsx)
- **Auth**: Firebase Authentication
- **Real-time**: WebSocket (ws)
- **Charts**: Recharts
- **State**: TanStack Query v5
- **Routing**: Wouter
- **i18n**: Custom LanguageProvider (English, Hindi, Marathi)

## Key Features

### Authentication (Firebase)
- Separate User and Admin login tabs at `/login`
- Admin detection by email: emails in `ADMIN_EMAILS` list (e.g. `admin@firead.com`)
- Protected routes: users → `/dashboard`, admins → `/admin` + `/action-log`
- Auth state persisted via Firebase `onAuthStateChanged`

### Bilingual AI Chatbot
- Floating chatbot widget on all authenticated pages
- Rule-based responses in English and Hindi
- 7 Q&A categories: auto-protection, risk levels, registration, micro-insurance, fund transfer, EMI pause, emergency contacts
- Language toggle button switches chatbot language in real-time
- Quick reply chips for fast interaction

### ML Risk Scoring with Feature Importance (Task 1)
- RiskGauge component shows feature importance inline and in tooltip
- 4 features: Rainfall Probability (40%), Wind Speed (25%), Historical Flood Risk (20%), Temperature Extremes (15%)
- Tooltip shows per-feature contribution bar chart
- Simulated Random Forest accuracy: 91.4%

### Financial Action Logging Dashboard (Task 3)
- Route: `/action-log` (admin only)
- 20 pre-seeded mock entries
- Real-time updates via WebSocket
- Recharts: Bar chart (actions by type) + Pie chart (status distribution)
- Full table with all log fields
- REST API: `GET /api/action-logs`, `POST /api/action-logs`

### Multilingual Support
- English, Hindi (हिंदी), Marathi (मराठी)
- Applied across all pages: Home, Dashboard, Alerts, Admin, components
- Language persisted in localStorage

## Project Structure

```
client/src/
  components/
    AuthProvider.tsx       # Firebase auth context
    Chatbot.tsx            # Bilingual floating chatbot
    Header.tsx             # Nav with auth state + user menu
    RiskGauge.tsx          # Gauge with ML feature importance
    LanguageProvider.tsx   # i18n context
    LanguageSelector.tsx   # Language dropdown
    AlertCard.tsx
    FinancialActionCard.tsx
    KPICard.tsx
  lib/
    firebase.ts            # Firebase config + admin email list
    chatbot-rules.ts       # Rule-based chatbot Q&A
    translations.ts        # All UI translations
  pages/
    Login.tsx              # User + Admin login tabs
    Dashboard.tsx          # User dashboard
    Alerts.tsx             # Alert management
    AdminDashboard.tsx     # Admin overview
    ActionLog.tsx          # Real-time financial action log
    Home.tsx               # Landing page

server/
  routes.ts               # API routes + WebSocket server
  storage.ts              # In-memory storage with mock data

shared/
  schema.ts               # Shared TypeScript types
```

## Demo Credentials
- **Admin**: `admin@firead.com` / `password123` (must be created in Firebase Console first)
- **User**: any email / 6+ character password (registers on first use)

## Environment Variables
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_PROJECT_ID`
