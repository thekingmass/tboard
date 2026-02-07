# TBoard

A full-stack project with a React (Vite) frontend and a Node/Express + MongoDB backend.

## Structure

- `Frontend/` — Vite + React UI
- `Backend/` — Express API + MongoDB (Mongoose)

## Prerequisites

- Node.js 18+ (recommended)
- npm (or your preferred package manager)

## Setup

Install dependencies in both apps:

```powershell
# Frontend
cd Frontend
npm install

# Backend
cd ..\Backend
npm install
```

## Environment Variables (Backend)

Create `Backend/.env` with:

```properties
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_cluster_name
PORT=4000
```

> Build the MongoDB connection string in code using these variables.

## Run (Development)

```powershell
# Backend
cd Backend
npm run dev

# Frontend (new terminal)
cd Frontend
npm run dev
```

Frontend runs on Vite’s default port (usually `5173`). Backend runs on `http://localhost:4000`.

## API (Backend)

- `GET /api/projects` — list projects
- `POST /api/projects/createNewProject` — create project
- `PUT /api/projects/updateProject/:id` — update project
- `DELETE /api/projects/deleteProject/:id` — delete project

## Notes

- Ensure CORS is enabled in the backend if frontend and backend run on different ports.
- This repository contains mock data for UI development; replace with API calls as needed.
