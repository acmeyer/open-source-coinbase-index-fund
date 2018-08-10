import {COINBASE_CLIENT, FIAT_CURRENCY} from '../env';
import {sellAll, buyWeight} from './trading';
import {getWeights} from '../utils/coinbaseWeights';
import _ from 'lodash';

function rebalancePortfolio() {
  return COINBASE_CLIENT.getAccounts().then(async (accounts) => {
    // Find all accounts, except for Fiat 
    let cryptoAccounts = _.filter(accounts, (account) => account.currency !== FIAT_CURRENCY);
    // for each account, sell all existing balances
    await cryptoAccounts.map(sellAll);
  }).then(() => {
    // Get the fiat account for purchases
    return COINBASE_CLIENT.getAccounts().then((accounts) => {
      return _.find(accounts, ['currency', FIAT_CURRENCY]);
    });
  }).then(async (fiatAccount) => {
    let availableBalance = parseFloat(fiatAccount.available);
    // buy each type of product at the new weights
    let weights = await getWeights();
    return weights.map(w => buyWeight(availableBalance, w));
  });
}

module.exports = {
  rebalancePortfolio,
};