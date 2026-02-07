/**
 * Date/time helpers shared across the backend.
 *
 * JWT uses Unix timestamps in seconds (iat/exp). These helpers convert them
 * into IST (Asia/Kolkata) strings and help compute validity from "now".
 */

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Convert Unix timestamp (seconds) to an IST date-time string.
 */
export function unixSecondsToIST(unixSeconds: number): string {
  if (!Number.isFinite(unixSeconds)) {
    throw new Error(`Invalid unixSeconds: ${unixSeconds}`);
  }

  return new Date(unixSeconds * 1000).toLocaleString('en-IN', {
    timeZone: IST_TIMEZONE,
    hour12: true,
  });
}

/**
 * Seconds until the given Unix timestamp (seconds). Negative means it's already past.
 */
export function secondsUntilUnixSeconds(unixSeconds: number) {
    const nowMS = Date.now();
  if (!Number.isFinite(unixSeconds)) {
    throw new Error(`Invalid unixSeconds: ${unixSeconds}`);
  }

  return Math.floor((unixSeconds * 1000 - nowMS) / 1000);
}

/**
 * Format iat/exp into IST strings and compute remaining validity from now.
 */
export function formatJwtTimesInIST(params: { iat?: number; exp?: number }) {
  const iatIST = typeof params.iat === 'number' ? unixSecondsToIST(params.iat) : null;
  const expIST = typeof params.exp === 'number' ? unixSecondsToIST(params.exp) : null;

  const validForSecondsFromNow =
    typeof params.exp === 'number' ? secondsUntilUnixSeconds(params.exp) : null;

  return {
    iatIST,
    expIST,
    validForSecondsFromNow,
  };
}
