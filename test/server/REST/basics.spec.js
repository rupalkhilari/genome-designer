import request from 'supertest';

const devServer = require('../../../devServer');

describe('REST', () => {
  let server;
  beforeEach(() => {
    server = devServer.listen();
  });
  afterEach(() => {
    server.close();
  });

  describe('basics', () => {
    it('returns a 404 for invalid routes', function testProject(done) {
      request(server)
        .get('/api/invalidEndpoint')
        .expect(404, done);
    });
  });
});
