# KABAS — Kanban Board Assessment System

A standalone web application that allows instructors to assess student teams' Kanban board contributions on GitHub and Jira at a glance.

## Architecture

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind + shadcn/ui |
| Backend | Express + TypeScript |
| Auth | JWT (8-hour sessions) |
| Storage | JSON file (`server/data/teams.json`) |

```
src/          ← React frontend
server/       ← Express API server
```
Hosted online on https://kabas-test.vercel.app/  Credentials email: admin@kabas.edu | kabas2025

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/adwaith-js/KABAS.git
cd KABAS
npm install
cd server && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Edit `server/.env` and set:
- `JWT_SECRET` — a long random string
- `INSTRUCTOR_EMAIL` — login email for the instructor
- `INSTRUCTOR_PASSWORD` — login password for the instructor

### 3. Run

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open **http://localhost:5173** and log in with the credentials from `server/.env`.

## API Endpoints

All endpoints except `/api/health` and `/api/auth/login` require a `Authorization: Bearer <token>` header.

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login — returns JWT |
| GET | `/api/teams` | List all teams |
| POST | `/api/teams` | Add a team |
| GET | `/api/teams/:id` | Get a team |
| PUT | `/api/teams/:id` | Update a team |
| DELETE | `/api/teams/:id` | Delete a team |
| POST | `/api/teams/:id/test` | Test team connection |
| GET | `/api/analysis/:teamId` | Full team analysis |
| GET | `/api/analysis/:teamId/issues` | Raw issues |
| GET | `/api/analysis/:teamId/members` | Member stats |

## Security

- JWT authentication with configurable expiry (default 8h)
- Helmet.js security headers
- Rate limiting: 100 req/15 min globally, 10 login attempts/15 min
- CORS restricted to configured frontend origin
- API tokens stored server-side only, never exposed to browser
