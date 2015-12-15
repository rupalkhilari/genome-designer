import { expect } from 'chai';
import { Block as exampleBlock } from '../../schemas/_examples';
import { set as dbSet } from '../../../server/database';
import request from 'supertest';
import devServer from '../../../devServer';

describe('REST', () => {
  let server;
  const sessionkey = '123456';
  beforeEach('server setup', () => {
    server = devServer.listen();
  });
  afterEach(() => {
    server.close();
  });

  const extendedBlock = Object.assign({}, exampleBlock, {
    some: 'field',
  });

  describe('Blocks', () => {
    //NOTE - order of these tests matters. ideally, we'd reset the database every time, but i dont know how to do that...

    it('GET a block that is not real returns null', (done) => {
      request(server)
        .get('/api/block/notrealblock')
        .set('sessionkey', sessionkey)
        .expect(200)
        .expect((result) => {
          expect(result.body).to.be.null;
        })
        .end(done);
    });

    it('POST to create a block with an ID', (done) => {
      const block = Object.assign({}, exampleBlock);
      delete block.id;

      request(server)
        .post('/api/block')
        .set('sessionkey', sessionkey)
        .send(block)
        .expect((res) => {
          const instance = res.body;
          const mockedSimilar = Object.assign({}, block, {
            id: instance.id,
          });
          expect(instance.id).to.not.be.undefined;
          expect(instance).to.eql(mockedSimilar);
        })
        .end(done);
    });

    it('POST should ignore IDs', (done) => {
      const block = Object.assign({}, exampleBlock);

      request(server)
        .post('/api/block')
        .set('sessionkey', sessionkey)
        .send(block)
        .expect((res) => {
          const instance = res.body;
          expect(instance.id).to.not.equal(block.id);
        })
        .end(done);
    });

    it('PUT to update a block', (done) => {
      request(server)
        .put(`/api/block/${exampleBlock.id}`)
        .set('sessionkey', sessionkey)
        .send(exampleBlock)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.eql(exampleBlock);
        })
        .end(done);
    });

    it('GET should return the instance by default', (done) => {
      request(server)
        .get(`/api/block/${exampleBlock.id}`)
        .set('sessionkey', sessionkey)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.not.be.undefined;
          expect(res.body).to.eql(exampleBlock);
          expect(res.body.instance).to.be.undefined;
          expect(res.body.tree).to.be.undefined;
        })
        .end(done);
    });

    it('GET should return the tree with query parameter', (done) => {
      request(server)
        .get(`/api/block/${exampleBlock.id}?tree=true`)
        .set('sessionkey', sessionkey)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.not.be.undefined;
          expect(res.body.instance).to.not.be.undefined;
          expect(res.body.instance).to.eql(exampleBlock);
          expect(res.body.components).to.not.be.undefined;
          //todo - actually interrogate the tree
        })
        .end(done);
    });

    //relies on the previous test
    it('GET an created block', (done) => {
      request(server)
        .get(`/api/block/${exampleBlock.id}`)
        .set('sessionkey', sessionkey)
        .expect(200)
        .expect((res) => {
          const instance = res.body;
          expect(instance).to.eql(exampleBlock);
        })
        .end(done);
    });

    it('PUT allows custom fields', (done) => {
      request(server)
        .put(`/api/block/${extendedBlock.id}`)
        .set('sessionkey', sessionkey)
        .send(extendedBlock)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.eql(extendedBlock);
        })
        .end(done);
    });

    it('should validate the block');
  });
});
