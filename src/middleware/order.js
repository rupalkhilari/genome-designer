import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { dataApiPath } from './paths';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import Order from '../models/Order';

// likely want a registry like for inventory and hit their respective functions for each foundry

// todo - handle errors, make consistent
export const submitOrder = (foundry, order) => {
  invariant(Order.validateSetup(order), 'order be valid partial order (prior to ID + foundry data)');

  //todo - validate foundry

  const url = dataApiPath(`order/submit`);
  const stringified = JSON.stringify({
    foundry,
    order,
  });

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json());
};

const getQuote = (foundry, order) => {
  invariant(false, 'not implemented');
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
