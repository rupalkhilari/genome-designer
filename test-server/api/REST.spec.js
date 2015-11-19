const request = require('supertest');
const devServer = require('../../devServer');

describe('Server', () => {
  let server;
  beforeEach(() => {
    server = devServer.listen();
  });
  afterEach(() => {
    server.close();
  });

  describe('REST API', () => {
    it('returns a 404 for invalid routes', function testProject(done) {
      request(server)
        .get('/api/asdfasdf')
        .expect(404, done);
    });
  });
});
