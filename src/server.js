import path from 'path';
import express from 'express';
import Parse from 'parse/node';
import {ParseServer} from 'parse-server';
import ParseDashboard from 'parse-dashboard';
import cluster from 'cluster';

import {
  APP_ID,
  SERVER_URL,
  SERVER_PORT,
  MASTER_KEY,
  DASHBOARD_USERS,
  DATABASE_URI,
  WORKERS,
  USE_ENCRYPTED_PASSWORDS,
  TRUST_PROXY,
  IS_DEVELOPMENT,
} from "./env";

Parse.initialize(APP_ID);
Parse.serverURL = SERVER_URL;
Parse.masterKey = MASTER_KEY;
Parse.Cloud.useMasterKey();

if (cluster.isMaster) {
  for (let i = 0; i < WORKERS; i += 1) {
    cluster.fork();
  }
} else {
  const server = express();

  server.use(
    '/api',
    new ParseServer({
      databaseURI: DATABASE_URI,
      cloud: path.resolve(__dirname, 'cloud.js'),
      appId: APP_ID,
      masterKey: MASTER_KEY,
      serverURL: SERVER_URL,
    })
  );

  let users = [];
  if (DASHBOARD_USERS) {
    DASHBOARD_USERS.split(',').map(u => {
      let [user, pass] = u.split(':');
      users.push({user, pass});
    });
  }

  server.use(
    '/dashboard',
    new ParseDashboard({
      apps: [{
        serverURL: SERVER_URL,
        appId: APP_ID,
        masterKey: MASTER_KEY, 
        production: !IS_DEVELOPMENT,
        appName: 'Open Source Coinbase Index Fund',
      }],
      users,
      useEncryptedPasswords: USE_ENCRYPTED_PASSWORDS,
      trustProxy: TRUST_PROXY,
    }, {
      cookieSessionSecret: COOKIE_SESSION_SECRET,
      allowInsecureHTTP: TRUST_PROXY,
    })
  );

  server.listen(SERVER_PORT, () => console.log(
    `Server is now running in ${process.env.NODE_ENV || 'development'} mode on ${SERVER_URL}`
  ));
}