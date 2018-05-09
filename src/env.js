import * as Gdax from 'gdax';

export const fiatCurrency = process.env.GDAX_FIAT_CURRENCY;
export const client = new Gdax.AuthenticatedClient(
  process.env.GDAX_API_KEY,
  process.env.GDAX_API_SECRET,
  process.env.GDAX_API_PASSPHRASE
);