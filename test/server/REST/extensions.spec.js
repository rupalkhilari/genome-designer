import { expect } from 'chai';
import { Block as exampleBlock } from '../../schemas/_examples';
import { set as dbSet } from '../../../server/utils/database';
import request from 'supertest';
import devServer from '../../../server/devServer';

describe('REST', () => {
  let server;
  const sessionkey = '123456';

  beforeEach('server setup', () => {
    server = devServer.listen();
    return dbSet(sessionkey, {});
  });
  afterEach(() => {
    server.close();
  });

  describe('Genbank extension', () => {
    //use old function syntax to create new scope so can call this.timeout
    it('accepts input and generates correct output', function historyAncestryTest(done) {
      this.timeout(10000);

      let block1 = exampleBlock;
      let bid1;
      let input1;

      request(server)
        .post('/api/block')
        .set('sessionkey', sessionkey)
        .send(block1)
        .expect((res) => {
          const block = res.body;
          bid1 = block.id;
          input1 = {
            'genbank': 'extensions/compute/genbank_to_block/sequence.gb',
            'sequence': 'storage/block/' + bid1 + '/sequence',
          };
        })
        .expect(200, callExtension);

      function callExtension() {
        request(server)
          .post('/exec/genbank_to_block')
          .set('sessionkey', sessionkey)
          .send(input1)
          .expect((res) => {
            const output = res.body;
            expect(output.block !== undefined);
            block1 = JSON.parse(output.block);
            block1.sequence.url = input1.sequence;
          })
          .expect(200, updateBlock);
      }

      function updateBlock() {
        request(server)
          .put('/api/block/' + bid1)
          .set('sessionkey', sessionkey)
          .send(block1)
          .expect((res) => {
            const block = res.body;
            expect(block.id === bid1);
            expect(block.sequence.url === input1.sequence);
          })
          .expect(200, done);
      }
    });
  });
});
