const request = require('supertest');

describe('Server API', () => {
  let server;
  beforeEach(function () {
    server = require('../../devServer').listen();
  });
  afterEach(function () {
    server.close();
  });

  it('responds to /api/project', function testProject(done) {
    request(server)
      .get('/api/project')
      .expect('yup', done);
  });
});
