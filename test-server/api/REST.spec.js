import { expect } from 'chai';
const request = require('supertest');
const devServer = require('../../devServer');

describe('REST API', () => {
  let server;
  beforeEach(() => {
    server = devServer.listen();
  });
  afterEach(() => {
    server.close();
  });

  it('returns a 404 for invalid routes', function testProject(done) {
    request(server)
      .get('/api/invalidEndpoint')
      .expect(404, done);
  });

  it('GET a block that is not real returns null', (done) => {
    request(server)
    .get('/api/block/notrealblock')
    .expect(200)
    .end((err, result) => {
      expect(result.body.instance).to.be.null;
      done();
    });
  });

  it('POST to create a block', (done) => {
    const block = {
      id: 'myTestBlock',
      some: 'field',
    };
    request(server)
      .post(`/api/block/${block.id}`)
      .send(block)
      .expect(200, done);
  });
});
