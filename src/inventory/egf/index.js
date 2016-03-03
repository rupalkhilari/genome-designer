import fetch from 'isomorphic-fetch';
import { parseResults, parseResult } from './parseResults';
import queryString from 'query-string';

export const url = 'http://ec2-52-30-192-126.eu-west-1.compute.amazonaws.com:8001/collections';

export const name = 'Edinburgh Genome Foundry';

export const search = (term, options) => {
  const opts = Object.assign(
    {
      start: 0,
      entries: 50,
    },
    options,
    {
      collection: 'yeastfab',
    }
  );

  return fetch(`${url}/search/${term}?${queryString.stringify(opts)}`)
    .then(resp => resp.json())
    .then(results => parseResults(results));
};

export const get = (id) => {
  return fetch(`${url}/yeastfab/parts/${id}`)
    .then(resp => resp.json())
    .then(result => parseResult(result));
};
