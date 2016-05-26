import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { dataApiPath } from './paths';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';

// likely want a registry like for inventory and hit their respective functions

export const createOrder = (projectId, order) => {
  const url = dataApiPath(`order/${projectId}`);
  const stringified = JSON.stringify(order);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json());
};

export const getOrder = (projectId, orderId) => {
  const url = dataApiPath(`order/${projectId}/${orderId}`);

  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

export const getOrders = (projectId) => {
  const url = dataApiPath(`order/${projectId}`);

  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

// todo - should this hit our server? Or just go straight to the foudnry
// todo - handle errors, make consistent
export const sendOrder = (foundry, order) => {
  invariant(false, 'not implemented');
};

const getQuote = (foundry, order) => {
  invariant(false, 'not implemented');
};
