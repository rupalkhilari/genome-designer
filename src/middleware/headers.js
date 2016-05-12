import merge from 'lodash.merge';

//header helpers for fetch

//set default options for testing (jsdom doesn't set cookies on fetch)
let defaultOptions = {};
if (process.env.NODE_ENV === 'test') {
  defaultOptions = { headers: { Cookie: 'sess=mock-auth' } };
}

export const headersGet = (overrides) => merge({}, defaultOptions, {
  method: 'GET',
  credentials: 'same-origin',
}, overrides);

export const headersPost = (body, overrides) => merge({}, defaultOptions, {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
}, overrides);

export const headersPut = (body, overrides) => merge({}, defaultOptions, {
  method: 'PUT',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
}, overrides);

export const headersDelete = (overrides) => merge({}, defaultOptions, {
  method: 'DELETE',
  credentials: 'same-origin',
}, overrides);
