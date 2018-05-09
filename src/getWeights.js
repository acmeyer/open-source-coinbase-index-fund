import rp from 'request-promise';
import cheerio from 'cheerio';
import {currencyMapper} from './utils/currencyMapper';
import {fiatCurrency} from './env';

const options = {
  uri: 'https://am.coinbase.com/index',
  transform: (body) => {
    return cheerio.load(body);
  }
}

function getWeights() {
  let weights = [];
  return rp(options).then(($) => {
    $('.methodology__currency').each((i, elem) => {
      let currency = $(elem).text();
      let amount = $(elem).next('.methodology__percentage').text();
      weights.push({
        productId: `${currencyMapper[currency]}-${fiatCurrency}`,
        amount: parseFloat(amount) / 100,
      });
    });
    return weights;
  }).catch(err => {
    console.log(err);
  });
}

module.exports = {
  getWeights,
};