# Wellness Challenges & Leaderboard Experience

A modern health-tech wellness platform built with **React 19, Vite, Tailwind CSS, Recharts, Framer Motion, and Lucide React**.

Designed with an emerald green and teal aesthetic, fluid typography, animated circular progress rings, 7-day trend charts, challenge habit tracking, transparent scoring, rule-based heuristic anti-cheat anomaly detection, and **interactive visitor profile creation**.

> **Clean State (No Preloaded Sample Data)**: The application starts in a clean state with zero preloaded activity logs. You can create your own participant profile, join challenges, log custom activities, and test calculations and anomaly rules directly.

---

## 👤 New Feature: Participant Profile Creation

Visitors can now create, personalize, and customize their own wellness profile:
- **Participant Name**: Enter your name to appear dynamically across the dashboard greeting and community leaderboard.
- **City / Region**: Set your location (e.g. *Austin, TX*, *London, UK*).
- **Personal Bio & Mantra**: Set your fitness goal or personal wellness motivation.
- **Badge Theme Selector**: Choose between vibrant avatar gradients (*Emerald*, *Teal*, *Indigo*, *Rose*, *Amber*) with auto-generated initials.
- **Customizable Daily Targets**:
  - Daily Steps Target (default: 10,000)
  - Active Cardio Target (default: 45 minutes)
  - Hydration Target (default: 8 glasses)
  - Sleep Rest Target (default: 8.0 hours)
- **Real-Time Integration**: Your customized targets immediately calibrate the dashboard circular progress rings, KPI baseline markers, and leaderboard entry.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm run dev
```
Navigate to the local URL displayed in the terminal (typically `http://localhost:5173`).

### 3. Build for Production
```bash
npm run build
```

---

## 🛠 Technology Stack

- **Frontend Framework**: React 19 (`react`, `react-dom`)
- **Build Tooling**: Vite
- **Styling**: Tailwind CSS (Tailwind v3 with `@tailwind base; components; utilities;`)
- **Charts**: Recharts (`ResponsiveContainer`, `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ReferenceLine`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Persistence**: `localStorage` API with in-memory fallback
- **Dataset**: `src/data/challenges.json` (10 curated wellness challenges)

---

## 📁 Project Architecture

```
wellness_challenges_leaderboard/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── hooks/
    │   └── useLocalStorage.js
    ├── data/
    │   ├── challenges.json       # 10 challenge definitions
    │   ├── activities.json       # Initial user activity records (clean empty array)
    │   └── participants.json     # Initial participants (clean empty array)
    ├── utils/
    │   ├── storage.js            # Versioned localStorage management
    │   ├── scoring.js            # Deterministic scoring formula & tie-breakers
    │   ├── anomalyDetection.js   # Heuristic rule-based anomaly detection engine
    │   ├── validation.js         # Input validation & limits
    │   ├── progress.js           # Challenge milestone math & 7-day stats
    │   └── leaderboard.js        # Ranking & participant aggregation
    ├── pages/
    │   ├── Dashboard.jsx         # KPI stats, 4 animated rings, Recharts weekly trend
    │   ├── Challenges.jsx        # Searchable, filterable challenge catalogue
    │   ├── MyProgress.jsx        # Activity log form (CRUD), validation & charts
    │   ├── Leaderboard.jsx       # Podiums, standings & anomaly audit modal
    │   └── NotFound.jsx          # Route fallback
    └── components/
        ├── layout/
        │   ├── Navbar.jsx        # Responsive navigation with profile trigger
        │   └── PageHeader.jsx    # Consistent title, subtitle & action bar
        ├── profile/
        │   └── ProfileModal.jsx  # Visitor profile creation, bio & target customization
        ├── dashboard/
        │   ├── StatCard.jsx      # Metric KPI cards
        │   ├── ActivityChart.jsx # Interactive 7-day Recharts bar chart
        │   └── ChallengePreview.jsx # Active challenge progress bars
        ├── challenges/
        │   ├── ChallengeCard.jsx # Challenge item card with enrollment action
        │   └── ChallengeFilters.jsx # Search, category, status & difficulty filters
        ├── progress/
        │   ├── ProgressRing.jsx  # Reusable SVG animated progress ring
        │   ├── ActivityForm.jsx  # Form with validation and real-time anomaly warning
        │   └── ActivityHistory.jsx # Activity records table with edit/delete actions
        ├── leaderboard/
        │   ├── LeaderboardTable.jsx # Top 3 podium, standings table & audit modal
        │   └── LeaderboardFilters.jsx # Search, multi-column sorting & filter dropdowns
        └── common/
            ├── Button.jsx        # Accessible button with variants
            ├── Badge.jsx         # Status and category badges
            ├── EmptyState.jsx    # Zero-state presentation cards
            └── Toast.jsx         # Framer Motion animated notifications
```

---

## 🏆 Scoring Formula Specification

Points are computed deterministically per unique calendar day to prevent duplicate entry gaming:

$$\text{Total Score} = \sum_{d \in \text{Days}} \text{DailyScore}(d) + (\text{Completed Challenges} \times 250) + (\text{Streak Days} \times 25)$$

### Daily Metric Rates & Caps
- **Steps**: 1 pt per 100 steps (capped at 300 pts/day, equivalent to 30,000 steps).
- **Active Cardio**: 2 pts per minute (capped at 240 pts/day, equivalent to 120 minutes).
- **Hydration**: 10 pts per glass up to 8 glasses + 5 bonus pts for up to 10 glasses (capped at 90 pts/day).
- **Sleep Rest**: 10 pts per hour (capped at 90 pts/day, equivalent to 9 hours).
- **Challenge Completion Bonus**: 250 bonus points per completed challenge.
- **Streak Bonus**: 25 bonus points per day of active streak.

### Deterministic Tie-Breakers
1. Completed Challenges (descending)
2. Total Active Minutes (descending)
3. Total 7-Day Steps (descending)
4. Alphabetical Name (ascending)

---

## 🛡️ Anti-Cheat Anomaly Detection Engine

Implemented in `src/utils/anomalyDetection.js`, the rule-based engine flags statistically implausible records:

| Heuristic Rule | Threshold | Flag Status | Reason |
|---|---|---|---|
| **Extreme Step Ceiling** | $> 55,000$ steps in a day | `Requires Review` (High) | Exceeds physiological upper boundary. |
| **High Step Ceiling** | $> 45,000$ steps in a day | `Unusual Activity` (Medium) | Far above standard endurance limit. |
| **Extreme Active Duration** | $> 800$ mins ($> 13.3$h) | `Requires Review` (High) | Implausible daily exercise volume. |
| **Impossible Step Cadence** | $> 300$ steps/min during short cardio ($>12\text{k steps in } \le 45\text{m}$) | `Requires Review` (High) | Step cadence exceeds human sprint capacity. |
| **Time Conflict** | Active Hours + Sleep Hours $> 24$h | `Unusual Activity` (Medium) | Day budget exceeds 24 hours. |
| **Overnight Spike** | $> 40,000$ steps day-over-day jump | `Unusual Activity` (Low) | Sudden uncharacteristic spike. |

---

## 🧪 Self-Testing Guide

1. **Set Up Your Profile**: Click the Profile Badge in the top right of the navigation or click **Edit Profile & Goals** on the Dashboard hero. Enter your name, city, bio, and daily targets.
2. **Join Challenges**: Go to **Challenges**, filter by category or difficulty, and click **Join Challenge**.
3. **Log Activities**: Go to **My Progress** or click **Log Activity** in the header. Enter steps, active cardio, water, or sleep.
4. **Verify Dynamic Updates**: The 4 circular progress rings, 7-day trend chart, enrolled challenge bars, and your leaderboard row update with your custom name and metrics.
5. **Test Real-Time Anomaly Warning**: In the activity form, enter an extreme number like `62,000` steps to verify the statistical warning banner.
6. **Test Leaderboard**: On the Leaderboard page, click **"+ Seed 20 Demo Competitors"** to test multi-participant rankings and podiums.
7. **Reset Anytime**: Click **Reset** in the top navigation to clear local storage back to a clean slate.
