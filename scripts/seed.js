import Parse from 'parse/node';
const Currency = Parse.Object.extend('Currency');
import {getWeights} from '../src/utils/coinbaseWeights';

import {
  APP_ID,
  SERVER_URL,
  MASTER_KEY,
} from "../src/env";

Parse.initialize(APP_ID);
Parse.serverURL = SERVER_URL;
Parse.masterKey = MASTER_KEY;
Parse.Cloud.useMasterKey();

function createCurrency(weight) {
  let currency = new Currency();
  currency.set('name', weight.productName);
  return currency.save().then(() => {
    return;
  }).catch(err => console.log(err));
}

// Seeds the database with the current currencies in the Coinbase Index Fund
async function run() {
  let weights = await getWeights();
  await weights.map(createCurrency);
  console.log('Currencies seeded!');
}

run();