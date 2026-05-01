# TBoard

A full-stack Trello-style task board with a React (Vite + TypeScript) frontend and a Node.js / Express + MongoDB (Mongoose) backend. Authentication uses JWT access tokens with HTTP-only refresh cookies.

## Repository Structure

```
tboard/
├── Backend/        # Express API + MongoDB (Mongoose), JWT auth
├── Frontend/       # Vite + React + TypeScript UI
├── Git Commands.md
└── README.md       # (this file)
```

- [Backend/README.md](Backend/README.md) — backend setup, scripts and env vars
- [Frontend/README.md](Frontend/README.md) — frontend setup and env vars

## Features

- User signup / login / logout with bcrypt-hashed passwords
- JWT access tokens + refresh-token rotation stored as HTTP-only cookies
- Project CRUD
- Kanban board: columns and tasks with drag-and-drop (`@hello-pangea/dnd`)
- Filtering / sorting of tasks
- Centralized error handling and request logging (`pino` / `pino-http`)

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- A MongoDB connection string (MongoDB Atlas or local)

## Quick Start

Install dependencies in both apps:

```powershell
# Backend
cd Backend
npm install

# Frontend
cd ..\Frontend
npm install
```

Create the env files described in the [Environment Variables](#environment-variables) section, then run both apps in separate terminals:

```powershell
# Terminal 1 — Backend (http://localhost:4000)
cd Backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd Frontend
npm run dev
```

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONGO_URI` | Yes | — | Full MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/tboard`). |
| `PORT` | No | `4000` | Port the Express server listens on. |
| `NODE_ENV` | No | `development` | Set to `production` to enable secure cookies and prod logger config. |
| `FRONTEND_ORIGIN` | Yes | — | Allowed CORS origin for the frontend (e.g. `http://localhost:5173`). |
| `JWT_SECRET` | Yes | — | Secret used to sign access tokens. |
| `JWT_EXPIRES_IN` | No | `10m` | Access-token lifetime (any `jsonwebtoken` duration string). |
| `JWT_REFRESH_SECRET` | No | falls back to `JWT_SECRET` | Secret used to sign refresh tokens. Use a distinct value in production. |
| `JWT_REFRESH_EXPIRES_IN` | No | `1d` | Refresh-token lifetime. |
| `COOKIE_MAX_AGE_MS` | No | computed from `JWT_EXPIRES_IN` | Max-age (ms) for the access-token cookie. |
| `REFRESH_COOKIE_MAX_AGE_MS` | No | computed from `JWT_REFRESH_EXPIRES_IN` | Max-age (ms) for the refresh-token cookie. |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Cost factor for bcrypt password hashing. |
| `LOG_LEVEL` | No | `info` (prod) / `debug` (dev) | Pino log level (`fatal`/`error`/`warn`/`info`/`debug`/`trace`). |

Example `Backend/.env`:

```properties
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tboard
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=10m
JWT_REFRESH_SECRET=replace_with_another_long_random_string
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12
LOG_LEVEL=debug
```

> Never commit `.env`. Add it to `.gitignore` and share secrets through a secure channel.

### Frontend (`Frontend/.env`)

The frontend currently uses a hard-coded API base URL of `http://localhost:4000` in [Frontend/src/api.ts](Frontend/src/api.ts). No env file is strictly required to run the app locally. If you switch to env-based config, Vite only exposes variables prefixed with `VITE_`:

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | `http://localhost:4000` | Backend API base URL used by the axios client. |

Example `Frontend/.env`:

```properties
VITE_API_BASE_URL=http://localhost:4000
```

## API Overview (Backend)

Base URL: `http://localhost:4000`

Auth:
- `POST /api/signup` — register a new user
- `POST /api/login` — login, sets access + refresh cookies
- `POST /api/logout` — clears session (auth required)
- `POST /api/auth/refresh` — rotate access token using refresh cookie
- `GET  /api/auth/me` — current user (auth required)

Projects (auth required):
- `GET    /api/projects`
- `POST   /api/projects/createNewProject`
- `PUT    /api/projects/updateProject/:id`
- `DELETE /api/projects/deleteProject/:id`

Tasks (auth required):
- `GET/POST/PUT/DELETE /api/tasks/...` — see [Backend/src/routes/taskRoutes.ts](Backend/src/routes/taskRoutes.ts)

Health:
- `GET /api/health` — service status

## Useful Scripts

Backend (`Backend/package.json`):
- `npm run dev` — start API with hot reload (`ts-node-dev`)
- `npm run build` — TypeScript compile to `dist/`
- `npm start` — run compiled server
- `npm run seed:columns` — seed default columns
- `npm run seed:tasks` — seed default tasks
- `npm run test:bcrypt` / `npm run test:email` — local sanity scripts

Frontend (`Frontend/package.json`):
- `npm run dev` — Vite dev server
- `npm run build` — type-check + production build
- `npm run preview` — preview production build
- `npm run lint` — ESLint

## Notes

- CORS is enabled in the backend; `FRONTEND_ORIGIN` must match the URL the browser uses to load the frontend.
- Cookies are issued with `secure: true` only when `NODE_ENV=production`. Use HTTPS in production.
- Use distinct, long random values for `JWT_SECRET` and `JWT_REFRESH_SECRET` in production.
