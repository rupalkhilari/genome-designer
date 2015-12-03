import request from 'supertest';
import { set as dbSet } from '../../../server/database';

const devServer = require('../../../devServer');

describe('REST', () => {
  let server;
  const sessionKey = '123456';
  beforeEach('server setup', () => {
    server = devServer.listen();
    return dbSet(sessionKey, {});
  });
  afterEach(() => {
    server.close();
  });

  describe('basics', () => {
    it('returns a 403 when not authenticated', (done) => {
      request(server)
        .get('/api/invalidEndpoint')
        .expect(403, done);
    });

    it('returns a 404 for invalid routes', function testProject(done) {
      request(server)
        .get('/api/invalidEndpoint')
        .set('session-key', sessionKey)
        .expect(404, done);
    });
  });
});
