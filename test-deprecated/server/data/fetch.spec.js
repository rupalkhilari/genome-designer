//this is sort of an end to end test... mostly testing the fetch interface

import { expect } from 'chai';
import fetch from 'isomorphic-fetch';
import { dataApiPath, getSessionKey } from '../../../../../src/middleware/api';
import { Block as exampleBlock } from '../../../../schemas/_examples';

describe.skip('REST', () => {
  describe('fetch', () => {
    //todo - explicitly make sure server has started

    it('basic test', (done) => {
      const testBlock = Object.assign({}, exampleBlock, {
        notes: {
          some: 'note',
        },
      });

      return fetch(dataApiPath(`block/${testBlock.id}`), {
        method: 'put',
        headers: {
          'Content-type': 'application/json',
          'sessionkey': getSessionKey(),
        },
        body: JSON.stringify(testBlock),
      })
        .then(res => res.json())
        .then(json => {
          expect(json).to.eql(testBlock);
          done();
        });
    });
  });
});
