# Futsal Manager

A web application for managing futsal matches, tracking player statistics, and balancing teams algorithmically.

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — build tool and dev server
- **MUI v7** — component library
- **React Router v7** — client-side routing with lazy loading
- **TanStack Query v5** — server state management, caching, and optimistic updates
- **React Hook Form** — form handling and validation
- **Firebase Firestore** — real-time database
- **Recharts** — data visualization
- **Day.js** — date formatting
- **Husky + Knip** — git hooks and dead code detection

## Features

### Dashboard

- Create and manage futsal matches
- Add/remove players (8–12 per match)
- Three-stage match lifecycle: `open → in_progress → completed`
- Team balancing with three algorithms:
  - **Power Index** — weighted formula: win rate (40%) + avg points (40%) + goal difference (20%)
  - **Win Rate** — balanced purely by win percentage
  - **Random** — random team assignment
- Player ratings displayed per chip with team averages
- Score entry and match completion

### Statistics

- **Leaderboards** — top 5 players per metric in responsive grid
- **Full Table** — sortable table with all metrics per player
- Metrics: matches played, wins, losses, draws, points, avg points, win rate, goals scored/conceded (total + avg), goal difference

### Player Profile

- Personal statistics summary
- Four charts: win rate over time, avg goals over time, goals per match (bar), results breakdown (pie)

### Contacts

- Full CRUD for player contacts
- Duplicate email validation
- Optimistic delete

## Architecture

Feature-based folder structure:
src/
├── layout/ # RootLayout, MainNavigation
├── pages/
│ ├── dashboard/ # Matches, team balancer
│ ├── contacts/ # Player management
│ ├── statistics/ # Leaderboards, full table
│ └── players/ # Player profile + charts
├── shared/ # Reusable components, hooks, utils
└── providers/ # Firebase, MUI theme

Key architectural decisions:

- **Derived state** — all statistics computed dynamically from match data using `useMemo`, never stored in DB
- **Player snapshots** — `{ id, name, lastName }` stored in each match to preserve history even after player deletion
- **Optimistic updates** — player deletion updates UI instantly before server confirms
- **Lazy loading** — all pages loaded on demand via `React.lazy`

## Getting Started

```bash
npm install
npm run dev
```

Requires a Firebase project with Firestore enabled. Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Team Balancing Algorithm

Teams are balanced using a **snake draft** pattern:

1. Players sorted by rating (descending)
2. Distributed in pattern: A, B, B, A, A, B, B, A... (repeats every 4)

This ensures both teams have similar total rating sums.

Players with fewer than 2 matches receive a neutral rating of **0.33** to avoid skewing results.
