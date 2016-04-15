import { assert, expect } from 'chai';
import uuid from 'node-uuid';
import request from 'supertest';
import Block from '../../../../src/models/Block';
import * as persistence from '../../../../server/data/persistence';
import * as rollup from '../../../../server/data/rollup';
import devServer from '../../../../server/server';
import { createExampleRollup } from '../../../utils/rollup';
import { range } from 'lodash';

describe('REST', () => {
  describe('Data', () => {
    describe('Info', () => {
      let server;
      const userId = 0; //testing

      const roll = createExampleRollup();

      const project = roll.project;
      const projectId = project.id;
      const [blockP, blockA, blockB, blockC, blockD, blockE] = roll.blocks;

      //add 5 weird sbol type blocks to roll
      const numberEsotericSbol = 5;
      const esotericSbol = 'sdlfkjasdlfkjasdf';
      const blocks = range(numberEsotericSbol).map(() => new Block({ rules: { sbol: esotericSbol } }));
      roll.blocks.push(...blocks);

      before(() => {
        return rollup.writeProjectRollup(projectId, roll, userId);
      });

      beforeEach('server setup', () => {
        server = devServer.listen();
      });
      afterEach(() => {
        server.close();
      });

      it('/info/FAKE returns 404', (done) => {
        const url = `/data/info/notReal`;
        request(server)
          .get(url)
          .expect(404, done);
      });

      it('/info/sbol returns map of sbol types present', (done) => {
        const url = `/data/info/sbol`;
        request(server)
          .get(url)
          .expect(200)
          .expect(result => {
            const { body } = result;
            expect(typeof body).to.equal('object');
            expect(body[esotericSbol]).to.equal(5);
          })
          .end(done);
      });

      it('/info/sbol/type returns matching blocks', (done) => {
        const url = `/data/info/sbol/${esotericSbol}`;
        request(server)
          .get(url)
          .expect(200)
          .expect(result => {
            expect(result.body.length).to.equal(5);
          })
          .end(done);
      });

      it('/info/components/id returns map of components', (done) => {
        const url = `/data/info/components/${blockP.id}`;
        request(server)
          .get(url)
          .expect(200)
          .expect(result => {
            const { body } = result;
            const keys = Object.keys(body);
            expect(keys.length).to.equal(6);
            assert(keys.every(key => roll.blocks.find(block => block.id === key)), 'got wrong key, outside roll');
          })
          .end(done);
      });

    });
  });
});
