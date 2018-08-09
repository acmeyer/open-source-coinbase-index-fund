const request = require('request');
import {APP_ID, SERVER_URL, MASTER_KEY} from '../src/env';

const options = {
  url: SERVER_URL + '/jobs/update_index',
  method: 'POST',
  headers: {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-Master-Key': MASTER_KEY
  }
};

function main() {
  request(options, (error, response, body) => {
    console.log(response.statusCode);
  });
  return 'OK';
}

main();
