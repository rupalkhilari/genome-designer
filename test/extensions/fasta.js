import _ from 'lodash';
import uuid from 'node-uuid';
import { expect } from 'chai';
import * as rollup from '../../server/data/rollup';
import { callExtensionApi } from '../../src/middleware/extensions'
import { numberBlocksInRollup, createExampleRollup } from '../utils/rollup';

const extensionKey = 'fasta';

describe('Extensions', () => {
  describe.only('FASTA', () => {
    const roll = createExampleRollup();
    const project = roll.project;
    const projectId = project.id;
    const leaves = _.values(roll.blocks).filter(block => block.components.length === 0);

    before(() => {
      return rollup.writeProjectRollup(projectId, roll, '0');
    });

    it('should be able to export specific blocks', () => {
      return callExtensionApi(extensionKey, `export/blocks/${projectId}/${leaves[0].id},${leaves[2].id}`)
        .then(resp => {
          expect(resp.status).to.equal(200);
          return resp.text();
        })
        .then(fasta => {
          console.log(fasta);
        });
    });
  });
});
