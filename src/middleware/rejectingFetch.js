import fetch from 'isomorphic-fetch';

//reject on 4xx and 5xx responses, otherwise should have no effect
export default function rejectingFetch(...args) {
  return fetch(...args)
    .then(resp => {
      if (resp.status >= 400) {
        return Promise.reject(resp);
      }
      return resp;
    });
}
