# Open Source Coinbase Index Fund
Create your own index fund on Coinbase Pro that replicates [Coinbase's Index Fund](https://am.coinbase.com).

## Why
Coinbase released their [Index Fund](https://am.coinbase.com) in March. However, it is restricted to accredited investors only and has a high 2% annual management fee.

The goal of this repository is to give anyone the ability to have an index of all assets listed on Coinbase Pro with lower fees.

## How to Use
### Sandbox
Coinbase has a public sandbox for testing. By default, the app is set to use the Sandbox API so that you don't accidentally execute real trades. 

All of the below instructions apply to the sandbox as well as real site. The only difference is the urls you use. 

You can add funds using the web interface deposit and withdraw buttons as you would on the production web interface.

#### Sandbox URLs
**Website:** https://public.sandbox.pro.coinbase.com

**API:** https://api-public.sandbox.pro.coinbase.com

#### Live Site URLs
**Website:** https://pro.coinbase.com

**API:** https://api.pro.coinbase.com

### Coinbase Pro
In order to use this code, you'll first need to have a [Coinbase Pro account](https://pro.coinbase.com). Once you have an account, you'll need to [create an API Key](https://pro.coinbase.com/profile/api), check all permissions. Make note of the API key, secret, and passphrase, you'll need these and you will not be able to see the secret or passphrase after you create it initially.

You'll also need to make sure you have enough funds in your Coinbase Pro account to execute the trades.


## One-time Usage vs Automatic Usage
There are two ways you can choose to use this repository. The first is to use it to make a one-time purchase of currencies on Coinbase Pro in the amount equal to their relative market cap sizes (see [One-time Usage](#one-time-usage) below). The second way is to use it as an automatic crypto index fund, much like if you were to buy into Coinbase's Index Fund (see [Automatic Usage](#automatic-usage) below).

## One-time Usage
The one-time usage executes trades in your Coinbase Pro account with the fiat currency of your choice to buy an amount of each crypto currency available equal to their relative market cap sizes. Note that this will use all of the fiat currency you have in your account available.

### Run on your own machine
First clone the repository `git clone https://github.com/acmeyer/open-source-coinbase-index-fund`. 

Next, you have to set environment variables for `COINBASE_API_URL`, `COINBASE_FIAT_CURRENCY`, `COINBASE_API_KEY`, `COINBASE_API_SECRET`, and `COINBASE_API_PASSPHRASE`. The fiat currency environment variable should be the fiat currency you want to do trades in. The default is 'USD'. The api url is provided above for both the sandbox and live environments.

Finally, all you have to do to purchase an index fund of available currencies on Coinbase Pro, run `yarn run fund` inside the app's directory. 

**Warning:** This will execute trades!

**Note:** it is assumed you followed the instructions above and your Coinbase Pro account has a sufficient balance in it to execute the trades. See above section [Coinbase Pro](#coinbase-pro) if not.

If you would like to run this code automatically whenever your Coinbase Pro account has a high enough balance, you can deploy this code to a server and use a scheduler.

### Deploy on a server
The easiest way to deploy this code to a server is by clicking the button below. Once you do that, you only have to set up the `COINBASE_API_URL`, `COINBASE_FIAT_CURRENCY`, `COINBASE_API_KEY`, `COINBASE_API_SECRET`, and `COINBASE_API_PASSPHRASE` environment variables and create a scheduler task that runs `yarn run fund`.

Once the server and scheduler are set, it will automatically make trades whenever your Coinbase Pro account has sufficient funds in the fiat currency you set the `COINBASE_FIAT_CURRENCY` to.

<a href="https://heroku.com/deploy" target="_blank">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

You can also deploy this code to other servers. The setup is very similar.

## Automatic Usage
Use this set up if you would like to convert your Coinbase Pro account into an Index Fund account. This set up a server to automatically manage your Coinbase Pro account to replicate [Coinbase's Index Fund](https://am.coinbase.com/index). 

**Note:** This set up will rebalance ALL currencies in your Coinbase Pro account to match the Index's weights, even if you already have different amounts of currencies in your account before running this server. Only use this set up if you don't care that the code will make trades to rebalance your account.

**Tip:** If you would like to keep the current amount of each currency but still want to also have an index of all currencies on Coinbase, transfer your current amounts into their respective wallets to your regular Coinbase account. Then anything in your Coinbase Pro account will be the Index Fund and anything in your regular Coinbase wallets won't be affected.

The goal is to add the ability to manage an individual Coinbase Pro account so that it can have an Index Fund and still execute other trades. If you would like the ability to do this, please submit a pull-request!

### Run on your own machine
First clone the repository `git clone https://github.com/acmeyer/open-source-coinbase-index-fund`.

Next, you have to set environment variables for `COINBASE_API_URL`, `COINBASE_FIAT_CURRENCY`, `COINBASE_API_KEY`, `COINBASE_API_SECRET`, and `COINBASE_API_PASSPHRASE`. The fiat currency environment variable should be the fiat currency you want to do trades in. The default is 'USD'. The api url is provided above for both the sandbox and live environments.

The code uses [Parse Server](https://github.com/parse-community/parse-server) to manage the server and [Parse Dashboard](https://github.com/parse-community/parse-dashboard) for a server dashboard. This repository has defaults for each's set up but you'll likely want to update the environment variables in `src/env.js` to match your own machine's configuration.

Once you have set up the environment variables, you can run the server using the command `yarn run start` inside the app's directory. If you are using a local version of mongodb, make sure that is running before you try and run the server.

In order to actually execute any trades, you have to either manually run the background job called `update_index` by running `yarn run updateIndex` inside the app's directory, or by clicking the **Run Now** button in the Parse Dashboard under **Jobs**.

**Note:** Running this code will execute trades!

To manage your Coinbase Pro account automatically, however, you'll need to set this up as a scheduled job. You can do this on your own machine but it's much easier to have a server manage it for you.

### Deploy on a server
The easiest way to deploy this code to a server is by clicking the button below. Once you do that, you have to set up the all the environment variables found in Heroku's **Config Vars** section under the app's **Settings** tab. 

Next, create a scheduler task that runs `yarn run updateIndex`. If you would like to match Coinbase's Index Fund exactly, then schedule this task to run daily at 12:00am UTC (5:00pm PT).

Once the server and scheduler are set, it will automatically check the current currency weights on Coinbase and rebalance your Coinbase Pro account to match, if necessary. See the below section on [Methodology](#methodology) to understand when these rebalances will happen.

Finally, in order to keep your orders up to date with Coinbase, add another scheduler task that runs `yarn run updateOrders`. You can set this to run at whatever frequency you desire. This task just keeps the orders in your database in sync with Coinbase.

**Note:** On first set up, the database will have no currencies already in it. That means the first time the `update_index` background job is run, it will rebalance your portfolio. This may be desirable if you want your account to be updated as soon as you set this server up, but if you don't want the rebalancing to happen right away and instead wait until either a new currency is added to Coinbase's Index Fund or January 1st of the next year, then you will need to seed your database with the current currencies before the background job runs. This can be easily done by running `yarn run seed` in the app's console.

<a href="https://heroku.com/deploy" target="_blank">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

You can also deploy this code to other servers. The setup is very similar.

## Methodology
This code is meant to replicate [Coinbase's Index Fund](https://am.coinbase.com/index). You can read more about their methodology here: https://am.coinbase.com/documents/cbi-methodology.pdf.

Currently, the asset weights are pulled from https://index-am.coinbase.com//v1/cbi/composition.json to match Coinbase's weights. In the future, the goal is to do this all automatically with an official calculation, that uses the same formula Coinbase does. That way, if Coinbase ever changes the url or otherwise removes the ability to get this information, the code can still work properly.

The two main takeaways are that the Index Fund gets rebalance when one of two things happens:

1. 5 days after a new currency is added to Coinbase Pro (at 5:00pm PT)
2. The 1st day of a new year (at 5:00pm PT)

If you run this repository on a server and schedule the background job `update_index` to run daily at 5:00pm PT (12:00am UTC) then it will automatically rebalance your Coinbase Pro account as outlined in the Methodology above.

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
- [x] Add a method to get weights rather than rely on scraping
- [x] Automatically rebalance account, annually and any time new asset is added to GDAX
- [ ] Add option to use different types of orders to avoid trading fees
- [ ] Add tests
- [ ] Better error handling
- [ ] Add background job to update executed orders on Coinbase Pro to keep data up to date
- [ ] Separate index fund vs rest of Coinbase Pro account
- [ ] Add frontend UI for viewing Index Fund's performance
- [ ] Add an official calculation of Methodology rather than pulling weights from Coinbase

## Disclaimer
This repository is for information purposes only. Use the code at your own risk. You may lose money if you use this code. Trading crypto currencies for real money is extremely risky and likely to result in disappointment. You bear sole responsibility for anything that happens using this code.
