# TBoard — Backend

Express + TypeScript API backed by MongoDB (Mongoose). Provides authentication (JWT access + refresh cookies), projects, columns and tasks endpoints for the TBoard frontend.

## Tech Stack

- Node.js / Express 5
- TypeScript (`ts-node-dev` for development)
- MongoDB via Mongoose
- `jsonwebtoken` for JWTs, `bcrypt` for password hashing
- `cookie-parser` for HTTP-only auth cookies
- `pino` / `pino-http` for structured logging

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string (Atlas or local)

## Setup

```powershell
cd Backend
npm install
```

Create a `.env` file in `Backend/` (see below), then start the dev server:

```powershell
npm run dev
```

The server listens on `http://localhost:4000` by default.

## Environment Variables

Create `Backend/.env` with the following keys. Only the ones marked **Required** must be set; the rest have sensible defaults.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONGO_URI` | Yes | — | Full MongoDB connection string. |
| `PORT` | No | `4000` | Port the Express server listens on. |
| `NODE_ENV` | No | `development` | `production` enables secure cookies + prod logger. |
| `FRONTEND_ORIGIN` | Yes | — | CORS origin allowed to call the API (e.g. `http://localhost:5173`). |
| `JWT_SECRET` | Yes | — | Secret for signing access tokens. |
| `JWT_EXPIRES_IN` | No | `10m` | Access-token lifetime (`jsonwebtoken` duration). |
| `JWT_REFRESH_SECRET` | No | falls back to `JWT_SECRET` | Secret for signing refresh tokens. Use a distinct value in prod. |
| `JWT_REFRESH_EXPIRES_IN` | No | `1d` | Refresh-token lifetime. |
| `COOKIE_MAX_AGE_MS` | No | derived from `JWT_EXPIRES_IN` | Max-age (ms) for the access-token cookie. |
| `REFRESH_COOKIE_MAX_AGE_MS` | No | derived from `JWT_REFRESH_EXPIRES_IN` | Max-age (ms) for the refresh-token cookie. |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Cost factor for bcrypt password hashing. |
| `LOG_LEVEL` | No | `info` (prod) / `debug` (dev) | Pino log level. |

Example `.env`:

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

> Never commit `.env`. Generate strong secrets, e.g. with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

## NPM Scripts

- `npm run dev` — start with hot reload (`ts-node-dev`)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled server (`node dist/index.js`)
- `npm run seed:columns` — seed default columns
- `npm run seed:tasks` — seed default tasks
- `npm run test:bcrypt` — quick bcrypt sanity check
- `npm run test:email` — email validation sanity check

## API Endpoints

Base URL: `http://localhost:${PORT}`

### Auth
- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout` (auth required)
- `POST /api/auth/refresh`
- `GET  /api/auth/me` (auth required)

### Projects (auth required)
- `GET    /api/projects`
- `POST   /api/projects/createNewProject`
- `PUT    /api/projects/updateProject/:id`
- `DELETE /api/projects/deleteProject/:id`

### Tasks (auth required)
- See [src/routes/taskRoutes.ts](src/routes/taskRoutes.ts).

### Health
- `GET /api/health`

## Project Structure

```
src/
├── index.ts              # App bootstrap, middleware, route mounting
├── logger.ts             # Pino logger config
├── auth/                 # JWT, refresh, session cookie helpers
├── controller/           # Route handlers
├── middleware/           # asyncHandler, errorHandler, requireAuth
├── models/               # Mongoose schemas
├── routes/               # Express routers
├── scripts/              # Seed and one-off scripts
├── types/                # Shared TS types
└── utils/                # validation, time helpers
```

## Notes

- CORS is configured with `credentials: true`; the frontend must send `withCredentials` for cookie auth to work.
- Refresh-token rotation is handled in [src/auth/refresh.ts](src/auth/refresh.ts) and [src/auth/sessionService.ts](src/auth/sessionService.ts).
- All errors flow through [src/middleware/errorHandler.ts](src/middleware/errorHandler.ts).
