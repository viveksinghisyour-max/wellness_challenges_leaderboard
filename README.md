# Wellness Challenges & Leaderboard Experience

A modern health-tech wellness platform built with **React 19, Vite, Tailwind CSS, Recharts, Framer Motion, and Lucide React**.

Designed with an emerald green and teal aesthetic, fluid typography, animated circular progress rings, 7-day trend charts, challenge habit tracking, transparent scoring, and rule-based heuristic anti-cheat anomaly detection.

> **Clean State (No Preloaded Sample Data)**: The application starts in a clean state with zero preloaded activity logs. You can join challenges, log custom activities, and test calculations and anomaly rules directly.

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
        │   ├── Navbar.jsx        # Responsive navigation with mobile menu
        │   └── PageHeader.jsx    # Consistent title, subtitle & action bar
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

> **Educational Notice**: Anomaly flags represent automated algorithmic checks for review and do not constitute absolute proof of misconduct. In a client-side prototype, `localStorage` can be inspected by users.

---

## 🧪 Self-Testing Guide

Because you requested clean data to test everything yourself:
1. **Join Challenges**: Go to **Challenges**, filter by category or difficulty, and click **Join Challenge**.
2. **Log Activities**: Go to **My Progress** or click **Log Activity** in the header. Enter:
   - Steps: e.g. `8,500`
   - Active Cardio: e.g. `45` minutes
   - Water: e.g. `8` glasses
   - Sleep: e.g. `7.5` hours
3. **Verify Dynamic Updates**: Notice how:
   - The 4 circular progress rings on the Dashboard animate to reflect your progress.
   - The 7-day Recharts bar chart updates with your new entries.
   - Your enrolled challenges update with live percentages.
   - Your score recalculates dynamically.
4. **Test Real-Time Anomaly Warning**: In the activity form, enter an extreme number like `62,000` steps. Notice the warning banner appear immediately before submission.
5. **Test Leaderboard**: On the Leaderboard page, you can optionally click **"+ Seed 20 Demo Competitors"** at any time to test multi-participant rankings, tie-breakers, and podiums.
6. **Reset Anytime**: Click **Reset** in the top navigation to clear local storage and start fresh.
