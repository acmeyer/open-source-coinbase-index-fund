import {COINBASE_CLIENT, FIAT_CURRENCY} from '../src/env';
import _ from 'lodash';
import {getWeights} from '../src/utils/coinbaseWeights';

function buy(productName, amount) {
  // Round amount down to nearest cent because Coinbase doesn't accept lower and
  // guarantees account has enough funds to make purchases
  let rounded_amount = Math.floor(amount * 100) / 100;
  const params = {
    type: 'market',
    funds: rounded_amount.toString(),
    product_id: productName + '-' + FIAT_CURRENCY,
  };
  COINBASE_CLIENT.buy(params).then((order) => {
    console.log('Order placed', order);
  }).catch(err => console.log('Error placing order', err.data.message));
}

function makePurchase(amount, weights) {
  weights.forEach(w => {
    const purchaseAmount = amount * w.amount;
    buy(w.productName, purchaseAmount.toString());
  });
}

function run() {
  COINBASE_CLIENT.getAccounts().then(async (accounts) => {
    let fiatAccount = _.find(accounts, ['currency', FIAT_CURRENCY]);
    let availableBalance = parseFloat(fiatAccount.available);
    let weights = await getWeights();
    // Note: the minmum order size is 10 so any trade smaller than this will fail 
    // but the others will go through
    makePurchase(availableBalance, weights);
  }).catch(err => console.log(err));
}

run();