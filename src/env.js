import * as Gdax from 'gdax';

// Coinbase
export const FIAT_CURRENCY = process.env.COINBASE_FIAT_CURRENCY;
export const COINBASE_CLIENT = new Gdax.AuthenticatedClient(
  process.env.COINBASE_API_KEY,
  process.env.COINBASE_API_SECRET,
  process.env.COINBASE_API_PASSPHRASE
);

// Server
export const APP_ID = process.env.APP_ID || 'open-source-coinbase-index-fund';
export const SERVER_PORT = process.env.PORT || 8080;
export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080/api';
export const MASTER_KEY = process.env.MASTER_KEY || '600d2b7409f821c0d6efe36694aba2ddffb45f8e2d901b55';
export const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/oscbif_dev';
export const WORKERS = process.env.WEB_CONCURRENCY || 1;
export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
// If USE_ENCRYPTED_PASSWORDS is set to true, then you will need to use a bcrypt generator
// like this one: https://www.bcrypt-generator.com, to encrypt it 
// then use that string in DASHBOARD_USERS for the password.
export const USE_ENCRYPTED_PASSWORDS = process.env.USE_ENCRYPTED_PASSWORDS || false;
export const DASHBOARD_USERS = process.env.DASHBOARD_USERS || 'admin:p@ssw0rds';
// Must trust server ssl config!!!
export const TRUST_PROXY = process.env.TRUST_PROXY || false;
export const COOKIE_SESSION_SECRET = process.env.COOKIE_SESSION_SECRET || '48875a701aa6556cb31'