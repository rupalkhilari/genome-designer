import fetch from 'isomorphic-fetch';

//todo - pending valentin support

export const url = 'http://ec2-52-30-192-126.eu-west-1.compute.amazonaws.com:8001/collections/igem';

export const search = (term) => {
  return fetch(`${url}/search/${term}`)
    .then(resp => resp.json())
    .then(results => parseResults(results));
};
