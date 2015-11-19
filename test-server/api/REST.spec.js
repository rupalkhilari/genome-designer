import { expect } from 'chai';
import { Block as exampleBlock } from '../../test/schemas/examples';
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

  const myTestBlock = Object.assign({}, exampleBlock, {
    some: 'field',
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
    request(server)
      .post(`/api/block/${myTestBlock.id}`)
      .send(myTestBlock)
      .expect(200, done);
  });

  it('GET an created block', (done) => {
    request(server)
      .get(`/api/block/${myTestBlock.id}`)
      .expect(200)
      .end((err, res) => {
        const { instance } = res.body;
        expect(instance).to.eql(myTestBlock);
        done();
      });
  });

  it('PUT should ignore ID', () => {});
});
