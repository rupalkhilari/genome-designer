import request from 'supertest';

const devServer = require('../../../../../server/devServer');

describe.skip('REST', () => {
  let server;
  const sessionkey = '123456';
  beforeEach('server setup', () => {
    server = devServer.listen();
    //todo - set auth key on start
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
        .set('sessionkey', sessionkey)
        .expect(404, done);
    });
  });
});
