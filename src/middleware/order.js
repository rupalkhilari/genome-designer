import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';

// likely want a registry like for inventory and hit their respective functions

// todo - should this hit our server? Or just go straight to the foudnry
// todo - handle errors, make consistent
export const sendOrder = (foundry, order) => {
  invariant(false, 'not implemented');
};

const getQuote = (foundry, order) => {
  invariant(false, 'not implemented');
};
