import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const logger = new Logger();

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  logger.error('Please using .env file to supply config environment variables');
}

export const { NODE_ENV } = process.env;
export const { PORT } = process.env;
export const { SESSION_SECRET } = process.env;
export const { MONGO_URI } = process.env;

if (!SESSION_SECRET) {
  logger.warn('No client secret. Set SESSION_SECRET environment variable.');
}

if (!MONGO_URI) {
  logger.warn(
    'No mongo connection string. Set MONGODB_URI environment variable.',
  );
}

export const { JWT_SECRET } = process.env;
export const { JWT_EXPIRES } = process.env;
