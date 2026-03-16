import type { Knex } from 'knex';
import { config as appConfig } from '../config/env';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

console.log('--- DB Config Trace ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Has DATABASE_URL:', !!process.env.DATABASE_URL);

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: isProd ? { rejectUnauthorized: false } : false
  } : {
    host: appConfig.database.host,
    port: appConfig.database.port,
    database: appConfig.database.name,
    user: appConfig.database.user,
    password: appConfig.database.password,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: isProd 
      ? path.join(__dirname, 'migrations')
      : path.join(__dirname, 'migrations'),
    extension: isProd ? 'js' : 'ts',
  },
};

export default knexConfig;