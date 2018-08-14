/* global Parse */
const Order = Parse.Object.extend('Order');
import {COINBASE_CLIENT} from '../env';
import {fromParseOrder} from './fromParseObjects';

async function updateOrder(order) {
  const dbOrder = fromParseOrder(order);
  const coinbaseOrder = await COINBASE_CLIENT.getOrder(dbOrder.coinbaseId);
  order.set('price', coinbaseOrder.price);
  order.set('size', coinbaseOrder.size);
  order.set('productId', coinbaseOrder.product_id);
  order.set('type', coinbaseOrder.type);
  order.set('side', coinbaseOrder.side);
  order.set('fillFees', coinbaseOrder.fill_fees);
  order.set('filledSize', coinbaseOrder.filled_size);
  order.set('executedValue', coinbaseOrder.executed_value);
  order.set('status', coinbaseOrder.status);
  order.set('settled', coinbaseOrder.settled);
  return order.save();
}

Parse.Cloud.job('update_orders', (request, status) => {
  let query = new Parse.Query(Order);
  query.equalTo('status', 'pending');
  return query.find().then(async results => {
    await results.map(updateOrder);
    return;
  });
});