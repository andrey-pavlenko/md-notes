/* global jest */
const axios = jest.genMockFromModule('axios');
const fs = require('fs');
const path = require('path');

let responses = {};

const __set = function(url, response) {
  responses[url] = response;
};

const __unset = function(url) {
  delete responses[url];
};

const get = function(url) {
  if (responses.hasOwnProperty(url)) {
    return Promise.resolve(responses[url]);
  } else {
    return new Promise((resolve, reject) => {
      fs.readFile(url, (error, data) => {
        if (error) {
          if (error.code !== 'ENOENT') {
            console.info('Unknown error', error);
          }
          reject({
            response: {
              status: 404,
              statusText: 'Not found'
            }
          });
        } else {
          data = data.toString();
          if (path.extname(url) === '.json') {
            resolve(JSON.parse(data));
          } else {
            resolve({ data });
          }
        }
      });
    });
  }
};

axios.get = get;
axios.__set = __set;
axios.__unset = __unset;

module.exports = axios;
