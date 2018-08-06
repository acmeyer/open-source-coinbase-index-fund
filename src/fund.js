import {COINBASE_CLIENT, FIAT_CURRENCY} from './env';
import _ from 'lodash';
import {getWeights} from './utils/getWeights';

function buy(productId, amount) {
  // Round amount down to nearest cent because Coinbase doesn't accept lower and
  // guarantees account has enough funds to make purchases
  let rounded_amount = Math.floor(amount * 100) / 100;
  const params = {
    type: 'market',
    funds: rounded_amount.toString(),
    product_id: productId,
  };
  COINBASE_CLIENT.buy(params).then((order) => {
    console.log('Order placed', order);
  }).catch(err => console.log('Error placing order', err.data.message));
}

function makePurchase(amount, weights) {
  weights.forEach(w => {
    const purchaseAmount = amount * w.amount;
    buy(w.productId, purchaseAmount.toString());
  });
}

function run() {
  COINBASE_CLIENT.getAccounts().then(async (accounts) => {
    let fiatAccount = _.find(accounts, ['currency', FIAT_CURRENCY]);
    let availableBalance = parseFloat(fiatAccount.available);
    let weights = await getWeights();
    let smallestAmount = _.min(_.map(weights, 'amount')) * availableBalance;
    // 10 is minimum order amount, the smallest order must be at least this much
    if (smallestAmount > 0) {
      makePurchase(availableBalance, weights);
    } else {
      console.log(`Balance on account isn\'t high enough to trade. You have ${availableBalance} ${FIAT_CURRENCY} to trade in your account.`);
    }
  }).catch(err => console.log(err));
}

run();