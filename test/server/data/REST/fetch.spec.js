//this is sort of an end to end test... mostly testing the fetch interface

import { expect } from 'chai';
import fetch from 'isomorphic-fetch';
import Project from '../../../../src/models/Project';
import { dataApiPath, getSessionKey } from '../../../../src/middleware/api';
import devServer from '../../../../server/devServer';

describe('REST', () => {
  describe.only('fetch', function fetchTest() {
    before((done) => {
      //make sure the server has actually started and is ready to go
      devServer.listen(3000, done);
    });

    it('basic test', (done) => {
      const testProject = new Project({
        notes: {
          some: 'note',
        },
      });

      return fetch(dataApiPath(`${testProject.id}`), {
        method: 'put',
        headers: {
          'Content-type': 'application/json',
          'sessionkey': getSessionKey(),
        },
        body: JSON.stringify(testProject),
      })
        .then(res => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then(json => {
          expect(json).to.eql(testProject);
          done();
        });
    });
  });
});
