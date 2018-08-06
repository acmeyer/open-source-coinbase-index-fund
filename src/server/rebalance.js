/* global Parse */

Parse.Cloud.job('rebalance', (request, status) => {
  // this job should do the following:
  // * get weights from coinbase and save to database
  // * check if any new asset(s) have been added since last check
  // * if new asset(s) exist, rebalance portfolio if it is 5th day since new asset(s) was added
  // * if today is jan 1st, rebalance portfolio
});