export const fromParseCurrency = (currency) => {
  return {
    id: currency.id,
    name: currency.get('name'),
  };
}

export const fromParseOrder = (order) => {
  return {
    id: order.id,
    coinbaseId: order.get('coinbaseId'),
    price: order.get('price'),
    size: order.get('size'),
    productId: order.get('productId'),
    type: order.get('type'),
    side: order.get('side'),
    fillFees: order.get('fillFees'),
    filledSize: order.get('filledSize'),
    executedValue: order.get('executedValue'),
    status: order.get('status'),
    settled: order.get('settled'),
  };
}