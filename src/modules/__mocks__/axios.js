const axios = jest.genMockFromModule('axios');

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
    return Promise.reject({
      response: {
        status: 404,
        statusText: 'Not found'
      }
    });
  }
};

axios.get = get;
axios.__set = __set;
axios.__unset = __unset;

module.exports = axios;
