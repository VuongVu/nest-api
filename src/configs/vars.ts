import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  console.log('Please using .env file to supply config environment variables');
}

export const { NODE_ENV } = process.env;
export const { PORT } = process.env;
export const { SESSION_SECRET } = process.env;
export const { MONGO_URI } = process.env;

if (!SESSION_SECRET) {
  console.log('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

if (!MONGO_URI) {
  console.log(
    'No mongo connection string. Set MONGODB_URI environment variable.',
  );
  process.exit(1);
}

export const { JWT_SECRET } = process.env;
export const { JWT_EXPIRES } = process.env;
