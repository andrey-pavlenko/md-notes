let mockedFecth;

let fetchResponses = {};

/**
 * @param {string} url
 * @returns {Promise}
 */
function fetchCallback(url) {
  const response = fetchResponses[url];
  if (response != null) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(`${url} not found`);
  }
}

function mockFecth() {
  if (mockedFecth == null) {
    mockedFecth = jest.fn(fetchCallback);
    // eslint-disable-next-line no-undef
    global.fetch = mockedFecth;
    return mockedFecth;
  } else {
    console.error('global.fetch already mocked');
  }
}

function unmockFecth() {
  if (mockFecth != null) {
    mockedFecth = undefined;
    // eslint-disable-next-line no-undef
    delete global.fetch;
  } else {
    console.error('global.fetch not mocked');
  }
}

/**
 * @param {string} url
 * @param {object} response
 * @returns {object} response
 */
function setResponse(url, response) {
  fetchResponses[url] = response;
  return response;
}

/**
 * @param {string} url
 * @returns {boolean}
 */
function removeResponse(url) {
  return delete fetchResponses[url];
}

function clearResponses() {
  fetchResponses = {};
}

/**
 * @param {string} url
 * @param {string} text
 * @param {object} response -- additional data
 * @returns {object} response
 */
function setResponseText(url, text, response = {}) {
  const _response = Object.assign(
    {
      status: 200,
      text: () => Promise.resolve(text)
    },
    response
  );
  return setResponse(url, _response);
}

/**
 * @param {string} url
 * @param {object} json
 * @param {object} response -- additional data
 * @returns {object} response
 */
function setResponseJson(url, json, response = {}) {
  const _response = Object.assign(
    {
      status: 200,
      json: () => Promise.resolve(json)
    },
    response
  );
  return setResponse(url, _response);
}

/**
 * @param {string} url
 * @param {object} response -- response data
 * @returns {object} response
 */
function setResponse404(url, response = {}) {
  const _response = Object.assign(
    {
      status: 404,
      statusText: 'Not found'
    },
    response
  );
  return setResponse(url, _response);
}

function makeNoteContent(meta, text) {
  if (meta != null) {
    meta = `<!---
${JSON.stringify(meta, null, 2)}
-->

`;
  } else {
    meta = '';
  }
  if (text == null) {
    text = 'Note content';
  }
  return `${meta}${text}\n`;
}

export {
  mockedFecth,
  mockFecth,
  unmockFecth,
  setResponse,
  removeResponse,
  clearResponses,
  setResponseText,
  setResponseJson,
  setResponse404,
  makeNoteContent
};
