
  # KABAS Dashboard Prototype Design

  This is a code bundle for KABAS Dashboard Prototype Design. The original project is available at https://www.figma.com/design/WVo189Q2tGI6nlGn4RtyQ9/KABAS-Dashboard-Prototype-Design.

  ## Architecture

  The project has two parts:
  - **Frontend** — React + Vite + TypeScript in `src/`
  - **Backend** — Express + TypeScript API server in `server/`

  ## Setup

  ### 1. Frontend

  ```bash
  npm install
  cp .env.example .env
  npm run dev
  ```

  The frontend runs on http://localhost:5173.

  ### 2. Backend

  ```bash
  cd server
  npm install
  npm run dev
  ```

  The backend runs on http://localhost:3001. Team credentials are stored in `server/data/teams.json` (auto-created on first run).

  ### Running both together

  Open two terminals:

  Terminal 1 (frontend):
  ```bash
  npm run dev
  ```

  Terminal 2 (backend):
  ```bash
  cd server && npm run dev
  ```

  ## Environment Variables

  Copy `.env.example` to `.env` and set:

  | Variable | Default | Description |
  |---|---|---|
  | `VITE_API_URL` | `http://localhost:3001` | Backend API base URL |

  ## API Endpoints

  | Method | Path | Description |
  |---|---|---|
  | GET | `/api/health` | Health check |
  | GET | `/api/teams` | List all teams |
  | POST | `/api/teams` | Create a team |
  | GET | `/api/teams/:id` | Get a team |
  | PUT | `/api/teams/:id` | Update a team |
  | DELETE | `/api/teams/:id` | Delete a team |
  | POST | `/api/teams/:id/test` | Test team connection |
  | GET | `/api/analysis/:teamId` | Full team analysis |
  | GET | `/api/analysis/:teamId/issues` | Raw issues |
  | GET | `/api/analysis/:teamId/members` | Member stats |
