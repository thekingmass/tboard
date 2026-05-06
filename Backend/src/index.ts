// src/index.ts
import 'dotenv/config';           // Load .env before anything else
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import projectsRoutes from './routes/projectsRoutes';
import signupRoutes from './routes/signupRoutes';
import loginRoutes from './routes/loginRoutes';
import meRoutes from './routes/meRoutes';
import logoutRoutes from './routes/logoutRoutes';
import refreshRoutes from './routes/refreshRoutes';
import taskRoutes from "./routes/taskRoutes";

import { errorHandler } from './middleware/errorHandler';

import { requireAuth } from './middleware/requireAuth';
import pinoHttp from 'pino-http';
import { logger } from './logger';


const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Request logging (method, path, status, response time, etc.)
// app.use(
//   pinoHttp({
//     logger,
//     // Avoid logging sensitive headers/cookies.
//     redact: {
//       paths: ['req.headers.cookie', 'req.headers.authorization'],
//       censor: '[REDACTED]',
//     },
//   })
// );

// Read env variables
const MONGO_URI = process.env.MONGO_URI as string;
const PORT = Number(process.env.PORT) || 4000;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env');
}

// Note: request logging is handled by pino-http above.
// Logging middleware for debugging
app.use((req, res, next) => {
  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`Incoming request: ${req.method} ${req.url} at ${istTime} IST`);
  next();
});

// Simple health endpoint
app.get('/api/health', (req, res) => {
  try{
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error occurred while checking health:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


// mount /api/signup route
app.use('/api/signup', signupRoutes);

// mount /api/login route
app.use('/api/login', loginRoutes);

// mount /api/logout route
app.use('/api/logout', requireAuth, logoutRoutes);

// mount /api/auth/refresh route
app.use('/api/auth/refresh', refreshRoutes);

// Mount /api/projects route
app.use('/api/projects', requireAuth, projectsRoutes);


// mount /api/me route (used by frontend to check current session)
app.use('/api/auth/me', requireAuth, meRoutes);


// Mount /api/tasks route
app.use('/api/tasks', requireAuth, taskRoutes);

// Central error handler (must be after all routes)
app.use(errorHandler);

// Connect to DB, then start server
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Seed initial data if needed
    // await seedProjectsIfEmpty();
    // await seedEmptyProjectTasks();

    app.listen(PORT, () => {
      console.log(`🚀 Backend API running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();
