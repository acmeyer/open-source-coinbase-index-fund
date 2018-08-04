import * as Gdax from 'gdax';

export const fiatCurrency = process.env.COINBASE_FIAT_CURRENCY;
export const client = new Gdax.AuthenticatedClient(
  process.env.COINBASE_API_KEY,
  process.env.COINBASE_API_SECRET,
  process.env.COINBASE_API_PASSPHRASE
);