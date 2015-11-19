//this is sort of an end to end test... mostly testing the fetch interface

import { expect } from 'chai';
import fetch from 'isomorphic-fetch';
import { Block as exampleBlock } from '../../test/schemas/examples';

const devServer = require('../../devServer');

const serverRoot = 'http://localhost:3000';

describe('fetch() with REST', () => {
  it('basic test', () => {
    const testBlock = Object.assign({}, exampleBlock, {
      notes: {
        some: 'note',
      },
    });

    fetch(serverRoot + '/api/block/bla', {
      method: 'put',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(testBlock),
    })
      .then(res => res.json())
      .then(json => {
        expect(json).to.eql(testBlock);
        console.log(json);
      });
  });
});
