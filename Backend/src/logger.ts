import pino from 'pino';

// Console-only logging for now.
// In production you typically want JSON logs; in dev we can pretty-print.

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino(
  isProd
    ? {
        level: process.env.LOG_LEVEL ?? 'info',
      }
    : {
        level: process.env.LOG_LEVEL ?? 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
);
