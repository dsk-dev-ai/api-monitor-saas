import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [WORKER] [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'api-monitor-worker' },
  format: combine(
    timestamp(),
    process.env.NODE_ENV === 'production' ? winston.format.json() : combine(colorize(), devFormat)
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({ filename: 'logs/worker-error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/worker.log' }),
        ]
      : []),
  ],
});
