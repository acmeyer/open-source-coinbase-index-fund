/* global Parse */
const CurrencyWeights = Parse.Object.extend('CurrencyWeights');
const Currency = Parse.Object.extend('Currency');
import {rebalancePortfolio} from './portfolio';
import {fromParseCurrency} from './fromParseObjects';
import {getWeights} from '../utils/coinbaseWeights';
import _ from 'lodash';

Parse.Cloud.job('update_index', async (request, status) => {
  let rebalance = false;

  // get existing assets for comparison
  let query = new Parse.Query(Currency);
  let existingCurrencies = await query.find();
  existingCurrencies = _.map(existingCurrencies.map(fromParseCurrency), 'name');
  
  // fetch latest weights from Coinbase
  let weights = await getWeights();
  let currencyWeights = new CurrencyWeights();
  let newCurrencies = [];
  weights.forEach(w => {
    newCurrencies.push(w.productName);
    currencyWeights.set(w.productName, w.amount);
  });
  await currencyWeights.save();

  // If currencies have changed, rebalance portfolio
  //
  // NOTE: assumes Coinbase only shows new currencies on their index after the 5 day waiting period
  // that they've outlined in their methodology
  if (!_.isEqual(existingCurrencies.sort(), newCurrencies.sort())) {
    rebalance = true;
    newCurrencies.forEach(async (currencyName) => {
      // check if it already exists, if it doesn't add it
      let currencyQuery = new Parse.Query(Currency);
      await currencyQuery.equalTo('name', currencyName).first().then(async (result) => {
        if (!result) {
          // it doesn't exist, so add it
          let currency = new Currency();
          currency.set('name', currencyName);
          await currency.save();
        }
      });
    });
  }

  // if today is Jan 1st, rebalance portfolio
  let today = new Date();
  let day = today.getUTCDate();
  let month = today.getUTCDate();
  if (day === 1 && month == 0) {
    rebalance = true;
  }

  if (rebalance) {
    return rebalancePortfolio().then(() => {
      console.log('Portfolio rebalanced!');
    }).catch(err => console.log(`Failed to rebalance portfolio: ${err}`));
  } else {
    return;
  }
});