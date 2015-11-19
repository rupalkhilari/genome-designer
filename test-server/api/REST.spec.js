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

  const extendedBlock = Object.assign({}, exampleBlock, {
    some: 'field',
  });

  describe('basics', () => {
    it('returns a 404 for invalid routes', function testProject(done) {
      request(server)
        .get('/api/invalidEndpoint')
        .expect(404, done);
    });
  });

  describe('Blocks', () => {
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
        .post(`/api/block/${exampleBlock.id}`)
        .send(exampleBlock)
        .expect(200, done);
    });

    //relies on the previous test
    it('GET an created block', (done) => {
      request(server)
        .get(`/api/block/${exampleBlock.id}`)
        .expect(200)
        .end((err, res) => {
          const { instance } = res.body;
          expect(instance).to.eql(exampleBlock);
          done();
        });
    });

    it('should persist extra fields');

    it('should return the instance by default');

    it('should return the tree with query parameter');

    it('PUT should ignore ID');
  });

  describe('Project', () => {

  });

  describe('Clone', () => {
    it('should create descendents with proper parent');
  });

  describe('History', () => {
    it('should retrieve history of an instance');
  });
});
