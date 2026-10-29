# Wellness Challenges & Leaderboard Experience

A modern, responsive, frontend-only health and wellness dashboard web application built strictly with **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. Designed with an emerald and teal aesthetic, fluid typography, native SVG progress rings, interactive SVG activity charts, challenge habit tracking, and transparent anti-cheat anomaly detection.

Zero external frameworks. Zero build steps. Zero third-party runtime libraries. Deployable as a static site to GitHub Pages, Netlify, or Vercel.

---

## Table of Contents

1. [Overview & Project Highlights](#overview--project-highlights)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started & How to Run](#getting-started--how-to-run)
5. [Page Directory & Feature Walkthrough](#page-directory--feature-walkthrough)
   - [Dashboard (`index.html`)](#1-dashboard-indexhtml)
   - [Challenges Catalogue (`challenges.html`)](#2-challenges-catalogue-challengeshtml)
   - [My Progress & Activity Logs (`progress.html`)](#3-my-progress-progresshtml)
   - [Leaderboard & Anomaly Audit (`leaderboard.html`)](#4-leaderboard--audit-leaderboardhtml)
   - [Automated Calculation Test Suite (`test.html`)](#5-calculation-test-suite-testhtml)
6. [Scoring Formula Specification](#scoring-formula-specification)
7. [Anti-Cheat Anomaly Detection Engine](#anti-cheat-anomaly-detection-engine)
8. [Data Persistence & State Management](#data-persistence--state-management)
9. [Mobile Responsiveness & Accessibility](#mobile-responsiveness--accessibility)
10. [Hosting & Deployment Guide](#hosting--deployment-guide)
11. [Current Heuristic Limitations & Future Enhancements](#current-heuristic-limitations--future-enhancements)

---

## Overview & Project Highlights

- **Pure Native Web Technologies**: Crafted without React, Vue, Tailwind, Bootstrap, Node.js, or external charting libraries (like Chart.js or D3).
- **Interactive Native SVG Graphics**: Circular progress rings with dynamic `stroke-dashoffset` CSS transitions and a full-featured 7-day weekly activity bar chart with hover tooltips and metric switching.
- **Dynamic Leaderboard**: Features 22 synthetic competitors alongside the active user (`Alex Rivera (You)`), with multi-column sorting, search filtering, and podium showcases.
- **Rule-Based Anomaly Detection**: Transparently identifies implausible physiological activity (e.g. 62,000 steps/day, 960 active minutes, or impossible step cadence of 1,400 steps/min).
- **Resilient Offline-First Storage**: Versioned `localStorage` with automatic JSON parsing and graceful in-memory fallback for environments where browser storage is restricted.
- **Accessible & Responsive**: Fully usable from mobile (375px), tablet (768px), to wide desktop displays (1440px+), adhering to WCAG contrast standards and `prefers-reduced-motion` settings.

---

## Technology Stack

| Layer | Implementation | Notes |
|---|---|---|
| **Structure** | Semantic HTML5 | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` with ARIA roles |
| **Styling** | Vanilla CSS3 | Custom design system using CSS variables, Flexbox, Grid, and smooth keyframe transitions |
| **Logic** | Vanilla JavaScript (ES6+) | Modular script architecture with dedicated domain modules attached to global namespaces |
| **Graphics** | Native SVG & CSS | Circular progress rings, bar charts, custom icons, and interactive SVG hit areas |
| **Persistence** | `localStorage` API | Versioned keys (`WELLNESS_V1_*`) with memory fallback and demo reset |
| **Testing** | Browser Unit Test Suite | Standalone test runner validating mathematical formulas and detection rules |

---

## Project Structure

```
wellness_challenges_leaderboard/
├── index.html             # Page 1: Main Dashboard with rings, weekly charts, & summary
├── challenges.html        # Page 2: Challenge Catalogue with search, filters, & enrollment
├── progress.html          # Page 3: Activity Tracking, CRUD records, & 7-day metric trends
├── leaderboard.html       # Page 4: Community Standings, podiums, & anti-cheat inspector
├── test.html              # Standalone automated calculation & rule unit test runner
├── css/
│   └── style.css          # Emerald & Teal design system, typography, and responsive styles
├── js/
│   ├── data.js            # Bundled dataset: challenges, initial logs, 22 synthetic participants
│   ├── storage.js         # Versioned localStorage management with memory fallback
│   ├── scoring.js         # Deterministic scoring formula, deduplication, & tie-breakers
│   ├── anomaly-detection.js # Heuristic rule engine for detecting physiological anomalies
│   ├── charts.js          # Reusable SVG progress rings & weekly interactive bar charts
│   ├── challenges.js      # Challenge catalogue filtering, search, and enrollment actions
│   ├── progress.js        # Form logging, CRUD updates, unit conversion, & progress rings
│   ├── leaderboard.js     # Standings sorting, podium rendering, & modal inspection
│   └── app.js             # Navigation, toast notifications, modals, & dashboard controller
├── assets/
│   └── images/            # Directory reserved for static media assets
└── README.md              # Complete project architecture & user documentation
```

---

## Getting Started & How to Run

Because this project relies exclusively on vanilla HTML, CSS, and JavaScript, **no build tools or dependencies need to be installed**.

### Method 1: Local HTTP Server (Recommended)

Using a local static server ensures all browser features behave consistently:

**Using Python (built into macOS, Linux, and Windows):**
```bash
# In the project root directory:
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

**Using Node static server (npx):**
```bash
npx serve .
```

### Method 2: Direct File Open (`file://`)

You can double-click `index.html` directly in your file explorer. Because the application uses traditional non-module script includes with clear namespace encapsulation, **there are no CORS errors when opening directly via `file://`**.

---

## Page Directory & Feature Walkthrough

### 1. Dashboard (`index.html`)
- **Personalized Welcome**: Time-of-day awareness (`Good morning/afternoon/evening, Alex Rivera! 🌟`).
- **4 Circular Progress Rings**:
  1. *Daily Steps* (Target: 10,000 steps)
  2. *Active Cardio* (Target: 45 minutes)
  3. *Hydration* (Target: 8 glasses)
  4. *Sleep & Rest* (Target: 8.0 hours)
- **7-Day Step Volume Chart**: Interactive SVG bar chart with day-by-day height mapping, goal reference lines, and hover tooltips.
- **Active Challenges Preview**: Real-time progress bars for joined challenges.
- **Recent Activities Log**: Quick overview of recent activity entries.
- **Top 5 Competitors Preview**: Live sneak peek of community leaderboard leaders.

### 2. Challenges Catalogue (`challenges.html`)
- **10 Curated Wellness Challenges** covering steps, cardio, hydration, sleep, and streaks:
  1. *Daily Step Challenge* (8,000 steps/day)
  2. *10,000 Steps a Day* (10,000 steps/day)
  3. *Weekly Walking Challenge* (60,000 steps/week)
  4. *Active Minutes Challenge* (45 active mins/day)
  5. *Hydration Habit Challenge* (8 glasses of water/day)
  6. *Consistent Sleep Routine* (8 hours rest/day)
  7. *Weekend Movement Challenge* (120 active minutes over weekends)
  8. *Seven-Day Wellness Streak* (7 consecutive days active)
  9. *Core & Cardio Blast* (30 active cardio mins/day)
  10. *Hydration Marathon* (10 glasses daily for endurance)
- **Interactive Controls**:
  - Live search input matching challenge name and description.
  - Multi-select filters by category (Steps, Activity, Hydration, Sleep, Streak).
  - Status filter (All, Enrolled, Available).
  - Difficulty filter (Easy, Medium, Hard).
  - One-click *Join Challenge* or *Leave Challenge* with duplicate enrollment prevention.

### 3. My Progress (`progress.html`)
- **Summary Metrics**: 7-day average steps, total active minutes, total hydration, and average nightly sleep.
- **Enrolled Goal Progress**: Cards tracking current user progress against each enrolled challenge target.
- **Activity Log Form**:
  - Supports logging Steps, Active Minutes, Water Glasses, and Sleep Hours.
  - Dynamic unit display update.
  - Immediate anomaly detection alert if an entered value exceeds physiological bounds.
  - Supports editing existing entries and deleting entries with confirmation.
- **Interactive 7-Day Chart**: Tab switcher to view Trends across Steps, Active Time, Water, or Sleep.
- **Activity Log Table**: Complete chronological listing with edit/delete actions.

### 4. Leaderboard & Audit (`leaderboard.html`)
- **Top 3 Podium Showcase**: Visual Gold 🥇, Silver 🥈, and Bronze 🥉 pedestals with participant badges and scores.
- **Current User Sticky Rank**: Floating banner highlighting Alex Rivera's current rank, points, and metrics.
- **Comprehensive Standings Table**:
  - 23 participants (22 synthetic + current user).
  - Sortable by: Overall Score, 7-Day Steps, Active Minutes, or Completed Challenges.
  - Filterable by: Top 10, Flagged Anomalies Only, or Verified Clean Only.
  - Anomaly Audit Status Badges (`Normal`, `Unusual Activity`, `Requires Review`).
- **Participant Details & Audit Modal**:
  - Click any row or badge to open the detailed breakdown.
  - Itemized point audit (Activity Points, Challenge Bonuses, Streak Points).
  - Anomaly inspection report explaining exact heuristic rules triggered (e.g., Marcus Turbo's cadence anomaly, Dave Speed's step ceiling).

### 5. Calculation Test Suite (`test.html`)
- Standalone browser-based unit test runner.
- Validates scoring formulas, step caps, cadence anomaly calculations, tie-breaker order, and deduplication logic without requiring Node.js or Jest.

---

## Scoring Formula Specification

The scoring formula (`js/scoring.js`) is transparent, deterministic, and protected against duplicate entry gaming:

$$\text{Total Score} = \sum_{d \in \text{Days}} \text{DailyScore}(d) + (\text{Completed Challenges} \times 250) + (\text{Streak Days} \times 25)$$

### Daily Activity Metric Breakdown

1. **Steps**:
   - Rate: $1 \text{ point per } 100 \text{ steps}$
   - Daily Cap: $300 \text{ points}$ (equivalent to 30,000 steps). Excess steps do not inflate points.
2. **Active Cardio**:
   - Rate: $2 \text{ points per active minute}$
   - Daily Cap: $240 \text{ points}$ (equivalent to 120 minutes).
3. **Hydration**:
   - Base Rate: $10 \text{ points per glass}$ up to 8 glasses ($80 \text{ pts}$).
   - Bonus Rate: $5 \text{ points per additional glass}$ up to 10 glasses max ($90 \text{ pts max}$).
4. **Sleep Rest**:
   - Rate: $10 \text{ points per hour of restful sleep}$
   - Daily Cap: $90 \text{ points}$ (equivalent to 9 hours).

### Deterministic Tie-Breakers
When two participants share identical scores, rankings are broken deterministically:
1. **Higher Number of Completed Challenges**
2. **Higher Total Active Minutes**
3. **Higher Total 7-Day Steps**
4. **Alphabetical by Participant Name**

---

## Anti-Cheat Anomaly Detection Engine

Implemented in `js/anomaly-detection.js`, this rule-based heuristic engine flags suspicious records without unfairly penalizing users:

| Heuristic Rule | Threshold | Flag Status | Reason / Explanation |
|---|---|---|---|
| **Extreme Step Ceiling** | $> 55,000$ steps in 24h | `Requires Review` (High) | Exceeds physiological upper boundary for standard daily movement. |
| **High Step Ceiling** | $> 45,000$ steps in 24h | `Unusual Activity` (Medium) | Far above standard human endurance thresholds. |
| **Extreme Active Duration** | $> 800$ active minutes ($13.3$h) | `Requires Review` (High) | Implausible daily exercise volume in a single calendar day. |
| **Impossible Step Cadence** | $> 300$ steps/min during short cardio ($>12\text{k steps in } \le 45\text{m}$) | `Requires Review` (High) | Cadence exceeds human sprinting capacity (demonstrated by *Marcus Turbo*). |
| **Day Time Budget Conflict** | Active Hours + Sleep Hours $> 24$h | `Unusual Activity` (Medium) | Mathematical impossibility in a 24-hour cycle. |
| **Extreme Day-to-Day Spike** | $> 40,000$ step jump overnight | `Unusual Activity` (Low) | Sudden uncharacteristic spike compared to prior baseline. |

### Educational Disclaimer
> **Important Note**: In client-side web applications, local storage is accessible to the end user. Automated anomaly flags provide algorithmic notifications for review and do not constitute absolute proof of cheating.

---

## Data Persistence & State Management

- **Storage Keys**:
  - `WELLNESS_V1_ACTIVITIES`: Array of user-recorded activity objects.
  - `WELLNESS_V1_ENROLLMENTS`: Array of enrolled challenges and completion flags.
  - `WELLNESS_V1_USER_PROFILE`: User profile attributes, streak, and preferences.
- **Duplicate Prevention**: Every activity log receives a unique identifier (`act_<timestamp>_<rand>`). Deduplication guards ensure an entry is never aggregated more than once.
- **In-Memory Fallback**: If `localStorage` is disabled or fails due to private browsing restrictions, an in-memory session store automatically handles reads and writes seamlessly.
- **Reset Feature**: A "Reset Demo Data" modal allows users to clear local changes and restore the pristine initial demonstration dataset at any time.

---

## Mobile Responsiveness & Accessibility

- **Breakpoints**:
  - Mobile: `375px` (single-column layout, sticky mobile drawer navigation, stacked tables).
  - Tablet: `768px` (2-column grids, optimized podium height).
  - Desktop: `1440px` (spacious multi-column layouts, elevated card hover micro-animations).
- **Accessibility (WCAG 2.1)**:
  - Contrast ratios meet or exceed AA standards.
  - Keyboard navigation: Full focus rings (`:focus-visible`), tab navigation, and `Escape` key listeners for modal dismissals.
  - Screen Readers: SVG progress rings use `role="progressbar"`, `aria-valuenow`, and descriptive `aria-label` tags.
  - Motion: Honors `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions.

---

## Hosting & Deployment Guide

This project can be deployed instantly to any static hosting provider:

### GitHub Pages
1. Push this repository to GitHub.
2. In your repository settings, navigate to **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then click **Save**.

### Netlify
1. Drag and drop the workspace folder into the [Netlify Drop](https://app.netlify.com/drop) console.
2. Or connect your GitHub repository; leave the build command blank and publish directory as `.`.

### Vercel
1. Run `npx vercel` in the project root, or import via the Vercel Dashboard as an "Other / Static" project.

---

## Current Heuristic Limitations & Future Enhancements

### Current Limitations
- **Client-Side Storage**: In a production enterprise app, scores and activity records would be verified and signed by a secure backend server.
- **Synthetic Competitors**: Participant profiles are generated from deterministic demo sets rather than live multiplayer WebSockets.

### Future Enhancements
- Integration with Web Bluetooth API or Web Health APIs to connect real heart-rate monitors and smart bands.
- Export / Import data feature (JSON / CSV backup of activity logs).
- Dark Mode toggle using CSS color variables.
