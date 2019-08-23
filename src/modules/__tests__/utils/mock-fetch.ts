import { readFile } from 'fs';

const mockFetchJsonSuccess = (response: object) => {
  return Promise.resolve({
    json: () => Promise.resolve(response)
  });
};

const mockFetchTextSuccess = (response: string) => {
  return Promise.resolve({
    text: () => Promise.resolve(response)
  });
};

const mockFetchReadFileText = (path: string): Promise<any> => { 
  return new Promise((resolve, reject) => {
    readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve({
        text: () => Promise.resolve(data.toString())
      })
    })
  });
};

export { mockFetchJsonSuccess, mockFetchTextSuccess, mockFetchReadFileText };
