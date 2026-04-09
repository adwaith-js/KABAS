# KABAS API Reference

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the login endpoint and expire after 8 hours.

---

## Endpoints

### Auth

#### POST `/api/auth/login`

Authenticates the instructor and returns a JWT.

**Request Body:**
```json
{
  "email": "admin@kabas.edu",
  "password": "kabas2025"
}
```

**Response (200):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "email": "admin@kabas.edu",
    "role": "instructor"
  }
}
```

**Errors:**
- `400` — Email or password missing
- `401` — Invalid credentials
- `429` — Too many login attempts (max 10 per 15 minutes)

---

### Teams

#### GET `/api/teams`

Returns all registered teams.

**Response (200):**
```json
[
  {
    "id": "abc123",
    "name": "Team Alpha",
    "platform": "GitHub",
    "url": "https://github.com/orgs/example/projects/1",
    "status": "Active",
    "lastSynced": "2026-04-08T12:00:00Z",
    "addedAt": "2026-04-01T10:00:00Z"
  }
]
```

#### POST `/api/teams`

Adds a new team with platform credentials.

**Request Body:**
```json
{
  "name": "Team Alpha",
  "platform": "GitHub",
  "url": "https://github.com/orgs/example/projects/1",
  "token": "ghp_xxxxxxxxxxxx"
}
```

#### GET `/api/teams/:id`

Returns a single team by ID.

#### PUT `/api/teams/:id`

Updates an existing team's details or credentials.

#### DELETE `/api/teams/:id`

Permanently removes a team and its stored credentials.

#### POST `/api/teams/:id/test`

Tests the stored credentials against the platform API.

**Response (200):**
```json
{
  "success": true,
  "message": "Connected to GitHub successfully"
}
```

---

### Analysis

#### GET `/api/analysis/:teamId`

Returns full analysis for a team including member stats, status breakdown, and outlier detection.

**Response (200):**
```json
{
  "teamId": "abc123",
  "platform": "GitHub",
  "totalTasks": 42,
  "toDo": 8,
  "inProgress": 12,
  "inReview": 5,
  "completed": 15,
  "backlog": 2,
  "members": [
    {
      "id": "user1",
      "name": "Alice",
      "totalTasks": 10,
      "completed": 6,
      "inProgress": 3,
      "backlog": 1,
      "avgCompletionTime": 4.2,
      "stdDeviation": 1.8,
      "efficiencyScore": 18.5
    }
  ],
  "longestOpenTasks": [],
  "mostOpenedMember": "Alice",
  "mostBacklogMember": "Bob",
  "mostTodoMember": "Charlie"
}
```

#### GET `/api/analysis/:teamId/issues`

Returns raw normalised issues for a team.

#### GET `/api/analysis/:teamId/members`

Returns per-member statistics only.

---

## Rate Limits

| Scope | Limit |
|---|---|
| Global | 2000 requests per 15 minutes |
| Login | 10 attempts per 15 minutes |

---

## Security Headers

All responses include Helmet.js security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy`

---

## CORS

Only requests from the configured `ALLOWED_ORIGIN` are permitted. Local development defaults to `http://localhost:5173` and `http://localhost:3000`.
