# StudySync — Student Productivity & Assignment Manager

A complete, responsive student productivity web application built with **React + Vite**. StudySync helps college students organize assignments, manage daily study tasks, track deadlines on a calendar, organize work by subject, and analyze productivity — all from a single polished dashboard.

> **Frontend only.** No backend, no database, no API keys. All data lives in your browser's `localStorage`.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Installation & setup](#installation--setup)
4. [Project structure](#project-structure)
5. [Architecture overview](#architecture-overview)
6. [How to use each feature](#how-to-use-each-feature)
7. [Data model](#data-model)
8. [Testing checklist](#testing-checklist)
9. [Production build & deployment](#production-build--deployment)
10. [Limitations](#limitations)
11. [Viva / presentation guide](#viva--presentation-guide)

---

## Features

- **Dashboard** — total / pending / completed / overdue task counts, completion percentage, weekly productivity bar chart, completion-by-subject chart, status donut chart, today's tasks, upcoming deadlines, recently completed tasks, quick-add button, and a motivational message that reacts to your progress.
- **My Tasks** — full CRUD with search (title & description), filters (subject, priority, status, due date), sorting (deadline, priority, newest, title), and list / card view toggle.
- **Task form** — one reusable form for adding and editing, with inline validation (required title, subject, and due date; trimmed whitespace; no invalid saves).
- **Calendar & deadlines** — lightweight month calendar (pure `Date` logic, no calendar library), month navigation, colored dots per task, today marker, per-date task panel, overdue list, and upcoming deadlines.
- **Subjects** — add / edit / delete with color picker, live task counts, completion progress bars, and a guard that prevents deleting subjects that still have tasks.
- **Analytics** — real statistics only: totals, completion rate, overdue count, weekly completion trend line chart, subject distribution chart, status donut, priority mix, and key insights. Graceful empty state when no tasks exist.
- **Settings** — light/dark theme, display name, week start day, in-app reminder preference, JSON export/import (with validation), and full data reset with confirmation.
- **UX polish** — toast notifications, confirmation dialogs for destructive actions, empty states with actions, responsive sidebar → mobile drawer, smooth animations, and full keyboard accessibility.

## Tech stack

| Technology | Purpose |
|---|---|
| React 18 | UI library (functional components + hooks) |
| Vite 6 | Dev server and production build tool |
| React Router 6 | Client-side routing (`HashRouter`) |
| Lucide React | Consistent icon set |
| Recharts | Dashboard & analytics charts |
| CSS 3 | Hand-written design system (CSS variables, no framework) |
| localStorage | Persistent storage (via a custom `useLocalStorage` hook) |

## Installation & setup

Requirements: **Node.js 18+** and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (http://localhost:5173)
npm run dev

# 3. Production build (outputs to dist/)
npm run build

# 4. Preview the production build locally
npm run preview
```

## Project structure

```
studysync/
├── public/
├── src/
│   ├── components/        # Reusable UI building blocks
│   │   ├── CalendarView.jsx   # Month grid + deadline side panels
│   │   ├── ChartCard.jsx      # Card wrapper for charts
│   │   ├── ConfirmDialog.jsx  # Global destructive-action dialog
│   │   ├── EmptyState.jsx     # Friendly "nothing here" screens
│   │   ├── Header.jsx         # Top bar: title, date, search, theme
│   │   ├── Layout.jsx         # App shell (sidebar + header + outlet)
│   │   ├── Modal.jsx          # Accessible dialog wrapper
│   │   ├── Sidebar.jsx        # Desktop nav / mobile drawer
│   │   ├── StatCard.jsx       # Summary statistic card
│   │   ├── SubjectCard.jsx    # Subject stats + progress bar
│   │   ├── TaskCard.jsx       # Task row/card + badges
│   │   ├── TaskFilters.jsx    # Search, filters, sort controls
│   │   ├── TaskForm.jsx       # Reusable add/edit form (validated)
│   │   ├── TaskList.jsx       # List/card renderer with empty state
│   │   └── Toast.jsx          # Notification stack
│   ├── context/
│   │   └── AppContext.jsx     # Global state + all CRUD actions
│   ├── hooks/
│   │   └── useLocalStorage.js # State ↔ localStorage sync
│   ├── pages/
│   │   ├── Analytics.jsx      # Charts & insights
│   │   ├── Calendar.jsx       # Calendar page wrapper
│   │   ├── Dashboard.jsx      # Overview dashboard
│   │   ├── Settings.jsx       # Preferences, backup, reset
│   │   ├── Subjects.jsx       # Subject management
│   │   └── Tasks.jsx          # Task management
│   ├── utils/
│   │   ├── dateUtils.js       # Date parsing/formatting, overdue logic
│   │   ├── exportUtils.js     # JSON backup build/validate/parse
│   │   └── taskUtils.js       # Filter/sort/aggregate pure functions
│   ├── App.jsx                # Routes
│   ├── main.jsx               # Entry point
│   └── index.css              # Design system & all styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Architecture overview

- **`AppContext`** is the single source of truth. It owns tasks, subjects, and settings (each persisted with `useLocalStorage`), plus toasts and a promise-based confirmation dialog. Components never touch `localStorage` directly.
- **Pure utilities** (`taskUtils`, `dateUtils`, `exportUtils`) contain all data processing — filtering, sorting, statistics, date math, and backup validation — keeping components focused on rendering.
- **Overdue rule:** a task is overdue only when `dueDate < today` (compared as calendar-day strings, never timestamps) **and** its status is not `Completed`.
- **IDs** come from `crypto.randomUUID()` (with a fallback), so React list keys are stable.
- **Validation on read:** malformed localStorage data or untrusted imports are normalized/filtered before use, so a corrupt value never crashes the app.
- **Routing** uses `HashRouter`, meaning the built app runs from any static host with zero server configuration.

## How to use each feature

| Feature | How to use |
|---|---|
| Add a task | Dashboard → "Quick Add Task", or My Tasks → "Add Task" |
| Edit a task | Pencil icon on any task row/card |
| Complete a task | Circular checkbox (or the button in card view) |
| Delete a task | Trash icon → confirm in the dialog |
| Search / filter / sort | Toolbar on the My Tasks page; header search jumps to Tasks |
| Change view | List / card toggle in the My Tasks toolbar |
| See deadlines | Calendar page — click any date to see its tasks |
| Manage subjects | Subjects page — add, edit (rename/color), delete |
| Analyze productivity | Analytics page — all charts from your real data |
| Switch theme | Moon/Sun icon in the header, or Settings |
| Backup | Settings → Export JSON (download) / Import JSON (restore) |
| Reset | Settings → Reset Everything → confirm |

## Data model

```json
{
  "id": "b3f1c1d2-…",
  "title": "Complete DBMS assignment",
  "description": "Prepare normalization notes",
  "subjectId": "9a2e-…",
  "dueDate": "2026-10-25",
  "priority": "High",
  "status": "Pending",
  "createdAt": "2026-10-18T10:24:00.000Z",
  "completedAt": null
}
```

```json
{
  "id": "9a2e-…",
  "name": "Database Management Systems",
  "color": "#6366f1",
  "createdAt": "2026-10-01T08:00:00.000Z"
}
```

localStorage keys: `studysync.tasks`, `studysync.subjects`, `studysync.settings`.

## Testing checklist

1. Run `npm run dev`, open the app, verify starter subjects exist on first launch.
2. Create, edit, complete, and delete tasks; refresh the browser — data persists.
3. Try saving an empty title → inline error, nothing saved.
4. Search, each filter, each sort order, and both views on My Tasks.
5. Add a subject with a color; try deleting a subject that has tasks → blocked with a message.
6. Navigate calendar months; verify dots match task due dates and today is highlighted.
7. Check dashboard/analytics numbers update immediately after any task change.
8. Export JSON, reset everything, re-import the file → data returns.
9. Toggle dark theme and reload → theme persists.
10. Resize to phone width → sidebar becomes a drawer, no horizontal scroll.

## Production build & deployment

```bash
npm run build     # creates dist/
npm run preview   # test the build locally
```

`vite.config.js` sets `base: './'`, and routing uses hashes, so the `dist/` folder can be hosted **as-is** on:

- **GitHub Pages** — push `dist/` to a branch or use Actions.
- **Netlify / Vercel / Cloudflare Pages** — set the publish directory to `dist`. No redirect rules needed.
- **Surge** — `npx surge dist`.

## Limitations

- Data is **per browser, per device** — localStorage is not synced across devices or browsers. Clearing site data deletes everything (use Export JSON first).
- In-app reminders only fire **while the app is open in a tab**; a frontend-only app cannot schedule OS-level notifications or background alerts.
- There are no accounts or authentication — this is intentionally a local-only tool, and nothing should ever be stored that requires real security.
- Very large task libraries (thousands of entries) will work but charts recompute on every change; keep exports as your long-term archive.

## Viva / presentation guide

**One-minute pitch:** "StudySync is a frontend-only React application that helps students manage assignments, deadlines, and study productivity. Everything persists in the browser's localStorage, and all analytics are computed live from real task data — there is no backend and no mock data."

**Likely questions & answers:**

- *Why React?* Component-based UI, unidirectional data flow, and hooks make state predictable. Functional components only.
- *How is state managed?* A single `AppContext` provider holds tasks/subjects/settings and exposes CRUD actions; pure utility functions do all filtering and aggregation.
- *How does persistence work?* A custom `useLocalStorage` hook mirrors React state into localStorage and rehydrates on load, with validation of whatever it reads.
- *How is "overdue" calculated?* Due dates are stored as `YYYY-MM-DD` strings and compared lexicographically against today; a task is overdue only if its date is earlier **and** it isn't completed.
- *Why HashRouter?* Zero-configuration deployment on any static host — no server rewrites needed.
- *How do you validate imports?* `validateBackup()` checks structure and sanitizes every field before replacing any data; invalid files are rejected with a toast.
- *Security?* No auth by design — nothing sensitive is stored, no API keys, no network calls.

**Demo flow (2 minutes):** Dashboard stats → quick-add a task → mark it complete (watch stats and charts change) → My Tasks search/filter → Calendar date selection → add a subject with a color → Analytics insights → Settings export → dark mode.
