import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000',
  // Needed when auth is stored in HttpOnly cookies.
  // Your backend must also enable CORS with credentials.
  withCredentials: true,
});

// ---- Refresh-token flow (HttpOnly cookies) ----
// Assumptions (adjust endpoints if your backend differs):
// - POST /api/auth/refresh -> sets new access/refresh cookies
// - GET  /api/auth/me      -> returns current user when authenticated
//
// Loop protection:
// - Never attempt refresh if the failing request is itself the refresh call
// - Only retry a request once

let refreshPromise: Promise<void> | null = null;

const REFRESH_URL = '/api/auth/refresh';

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    // Don't try to refresh if we're already calling refresh.
    if (originalRequest.url === REFRESH_URL) {
      return Promise.reject(error);
    }

    // Avoid infinite loops by retrying each request only once.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post(REFRESH_URL).then(() => undefined);
      }

      await refreshPromise;
      refreshPromise = null;

      // Retry the original request (cookies now updated).
      return api(originalRequest);
    } catch (refreshErr) {
      refreshPromise = null;
      return Promise.reject(refreshErr);
    }
  }
);

