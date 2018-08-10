/* global Parse */
import {COINBASE_CLIENT, FIAT_CURRENCY} from '../env';
const Order = Parse.Object.extend('Order');

// Response object from Coinbase
// {
//   "id": "d0c5340b-6d6c-49d9-b567-48c4bfca13d2",
//   "price": "0.10000000",
//   "size": "0.01000000",
//   "product_id": "BTC-USD",
//   "side": "buy",
//   "stp": "dc",
//   "type": "limit",
//   "time_in_force": "GTC",
//   "post_only": false,
//   "created_at": "2016-12-08T20:02:28.53864Z",
//   "fill_fees": "0.0000000000000000",
//   "filled_size": "0.00000000",
//   "executed_value": "0.0000000000000000",
//   "status": "pending",
//   "settled": false
// }

async function buy(productName, amount) {
  // Round amount down to nearest cent because Coinbase doesn't accept lower and
  // guarantees account has enough funds to make purchases
  let rounded_amount = Math.floor(amount * 100) / 100;
  const params = {
    type: 'market',
    funds: rounded_amount.toString(),
    product_id: productName + '-' + FIAT_CURRENCY,
  };
  return COINBASE_CLIENT.buy(params).then(async (order) => {
    // Save order for record keeping
    let newOrder = new Order({
      coinbaseId: order.id,
      price: order.price,
      size: order.size,
      productId: order.product_id,
      type: order.type,
      side: 'buy',
      fillFees: order.fill_fees,
      filledSize: order.filled_size,
      executedValue: order.executed_value,
      status: order.status,
      settled: order.settled,
    });
    await newOrder.save();
    console.log('Order placed', order);
  }).catch(err => console.log('Error placing order', err.data.message));
}

async function sell(productName, amount) {
  const params = {
    type: 'market',
    size: amount.toString(),
    product_id: productName + '-' + FIAT_CURRENCY,
  };
  return COINBASE_CLIENT.sell(params).then(async (order) => {
    // Save order for record keeping  
    let newOrder = new Order({
      coinbaseId: order.id,
      price: order.price,
      size: order.size,
      productId: order.product_id,
      type: order.type,
      side: 'sell',
      fillFees: order.fill_fees,
      filledSize: order.filled_size,
      executedValue: order.executed_value,
      status: order.status,
      settled: order.settled,
    });
    await newOrder.save();
    console.log('Order placed', order);
  }).catch(err => console.log('Error placing order', err.data.message));
}

function buyWeight(totalAmount, weight) {
  const purchaseAmount = totalAmount * weight.amount;
  buy(weight.productName, purchaseAmount.toString());
}

function sellAll(account) {
  return sell(account.currency, account.balance);
}

module.exports = {
  buyWeight,
  sellAll,
};