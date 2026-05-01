# TBoard — Frontend

React 19 + TypeScript + Vite UI for the TBoard project. Talks to the [TBoard backend](../Backend/README.md) over HTTP with cookie-based auth.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- React Router 7
- Axios (HTTP client) with cookie-based auth
- `@hello-pangea/dnd` for Kanban drag-and-drop
- `sonner` for toast notifications
- `react-icons`
- ESLint + typescript-eslint

## Prerequisites

- Node.js 18+
- npm
- A running TBoard backend (see [Backend/README.md](../Backend/README.md))

## Setup

```powershell
cd Frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` by default.

## Environment Variables

Vite only exposes variables prefixed with `VITE_` to the browser. The frontend currently uses a hard-coded API base URL in [src/api.ts](src/api.ts); the variable below is recommended if you switch to env-driven config.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | `http://localhost:4000` | Backend API base URL used by the axios client. |

Example `Frontend/.env`:

```properties
VITE_API_BASE_URL=http://localhost:4000
```

> Make sure the backend's `FRONTEND_ORIGIN` matches the URL where this app is served (e.g. `http://localhost:5173`), otherwise CORS / cookie auth will fail.

## NPM Scripts

- `npm run dev` — start the Vite dev server (HMR)
- `npm run build` — type-check (`tsc -b`) and produce a production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Project Structure

```
src/
├── api.ts                    # Axios instance + interceptors
├── App.tsx / main.tsx        # App entry
├── auth/AuthContext.tsx      # Auth state and helpers
├── components/               # Pages, layouts, board, shared UI
│   ├── BoardComponents/      # Kanban board, columns, task cards
│   ├── loginSignupComponents/
│   └── sharedComponents/     # Button, InputBox, Modal, etc.
├── staticData/               # Mock/board fixtures
├── types.ts                  # Shared TS types
└── utils/                    # Small helpers (e.g. initials)
```

## Notes

- The axios client must be configured with `withCredentials: true` so refresh / access cookies are sent to the backend.
- Auth-protected routes are wrapped via [src/components/auth/ProtectedRoute.tsx](src/components/auth/ProtectedRoute.tsx).
- For production, set `VITE_API_BASE_URL` to the deployed backend URL and rebuild.
