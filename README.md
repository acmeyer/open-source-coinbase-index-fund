# Open Source GDAX Index Fund
Create your own index fund on GDAX that replicates [Coinbase's Index Fund](https://am.coinbase.com).

## Why
Coinbase released their [Index Fund](https://am.coinbase.com) in March. However, it is restricted to accredited investors only and has a high 2% annual management fee.

The goal of this repository is to give anyone the ability to have an index of all assets listed on GDAX with lower fees.

## How to Use
### GDAX
In order to use this code, you'll first need to have a [GDAX account](https://gdax.com). Once you have an account, you'll need to [create an API Key](https://www.gdax.com/settings/api), check all permissions. Make note of the API key, secret, and passphrase, you'll need these.

You'll also need to have enough funds (in your currency of choice) in your GDAX account.

### On your own machine
First clone the repository `git clone https://github.com/acmeyer/open-source-gdax-index-fund`. 

Next, you have to set environment variables for `GDAX_FIAT_CURRENCY`, `GDAX_API_KEY`, `GDAX_API_SECRET`, and `GDAX_API_PASSPHRASE`. The fiat currency environment variable should be the fiat currency you want to do trades in. The default is 'USD'.

Finally, to purchase an index fund of available assets on GDAX, run `yarn run fund` inside the app's directory. 

**Warning:** This will execute trades, make sure you know what you're doing!!

**Note:** it is assumed you followed the instructions above and your GDAX account has a sufficient balance in it to execute the trades. See above section **GDAX** if not.

For now, you have to execute this script everytime you want to add funds to your index. If you would like to do this automatically whenever your GDAX account has a high enough balance, you may want to deploy this code to a server and use a scheduler.

### Deploy on a server
The easiest way to deploy this code to a server is by clicking the button below. Once you do that, you only have to set up the `GDAX_FIAT_CURRENCY`, `GDAX_API_KEY`, `GDAX_API_SECRET`, and `GDAX_API_PASSPHRASE` environment variables and create a scheduler task that runs `npm run fund`.

Once the server and scheduler are set, it will automatically make trades whenever your GDAX account has sufficient funds in the fiat currency you set the `GDAX_FIAT_CURRENCY` to.

<a href="https://heroku.com/deploy" target="_blank">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

You can also deploy this code to other servers. The setup is very similar.

## Methodology
This code is meant to replicate [Coinbase's Index Fund](https://am.coinbase.com). You can read more about their methodology here: https://am.coinbase.com/documents/cbi-methodology.pdf.

Currently, the asset weights are pulled from https://am.coinbase.com/index to match Coinbase's weights. In the future, the hope is to do this all automatically with an official calculation, that uses the same formula Coinbase does. This script also does not rebalance a GDAX account automatically on an annual basis or 5 days after a new asset is added to GDAX, like the above methodology outlines. This will be added in the future.

## License
Released under the MIT License. See [LICENSE](LICENSE) or http://opensource.org/licenses/MIT for more information.

## Contributing
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Create a Pull-Request on the master branch for your feature/fix

## Todos
- [ ] Add a method to calculate weights rather than rely on scraping
- [ ] Automatically rebalance account, annually and any time new asset is added to GDAX
- [ ] Figure out way to separate index fund vs rest of GDAX account

## Disclaimer
This repository is for information purposes only. Use the code at your own risk. You may lose money if you use this code. Trading crypto currencies for real money is extremely risky and likely to result in disappointment. You bear sole responsibility for anything that happens using this code.