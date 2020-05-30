import dotenv from 'dotenv';

dotenv.config();

export const port = parseInt(process.env.PORT || '9090', 10);
export const endpoint = process.env.ENDPOINT || `http://localhost:${port}`;
export const sessionSecret = process.env.SESSION_SECRET || 's3cre7';

export const logLevel = process.env.LOG_LEVEL || 'info';
export const logFormat = process.env.LOG_FORMAT || 'json';

export const postgresHost = process.env.POSTGRES_HOST;
export const postgresPort = parseInt(process.env.POSTGRES_PORT, 10);
export const postgresUser = process.env.POSTGRES_USER;
export const postgresPassword = process.env.POSTGRES_PASSWORD;
export const postgresDatabase = process.env.POSTGRES_DATABASE;

export const redisHost = process.env.REDIS_HOST || 'localhost';
export const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
export const redisPassword = process.env.REDIS_PASSWORD || undefined;
