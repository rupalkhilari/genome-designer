import { assert, expect } from 'chai';

import request from 'supertest';
import devServer from '../../server/devServer';

describe('Extensions', () => {
  describe('REST', () => {
    let server;

    beforeEach('server setup', () => {
      server = devServer.listen();
    });
    afterEach(() => {
      server.close();
    });

    it('should list the extensions, manifests keyed by name', (done) => {
      const url = '/extensions/list';
      request(server)
        .get(url)
        .expect(200)
        .end((err, result) => {
          if (err) {
            done(err);
          }

          expect(result.body).to.be.an.object;
          assert(Object.keys(result.body).length > 0, 'there should be extensions registered');
          assert(Object.keys(result.body).every(key => {
            const manifest = result.body[key];
            const { name, version, region } = manifest;
            return !!name && !!version && !!region;
          }), 'invalid manifest format');
          done();
        });
    });

    it('/manifest/ to get manifest', (done) => {
      const url = '/extensions/manifest/simple';
      request(server)
        .get(url)
        .expect(200)
        .end((err, result) => {
          if (err) {
            done(err);
          }
          expect(result.body).to.be.an.object;
          assert(result.body.name === 'simple');
          assert(result.body.region === 'sequenceDetail');
          done();
        });
    });

    it('/load/ to get the index.js script', (done) => {
      const url = '/extensions/load/simple';
      request(server)
        .get(url)
        .expect(200)
        .end((err, result) => {
          if (err) {
            done(err);
          }

          assert(result.text.indexOf('render'), 'should return script with a render() function');
          assert(result.text.indexOf('gd.registerExtension'), 'should return script which registers itself using registerExtension on the client');

          done();
        });
    });
  });
});
