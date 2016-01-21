import { expect } from 'chai';
import range from '../../src/utils/array/range';
import * as actions from '../../src/actions/blocks';
import blocksReducer from '../../src/reducers/blocks';
import { simpleStore } from '../store/mocks';
import Block from '../../src/models/Block';

describe('Block Actions', () => {
  const storeBlock = new Block();
  const initialState = {
    [storeBlock.id]: storeBlock,
  };
  const blockStore = simpleStore(initialState, blocksReducer, 'blocks');

  it('blockCreate() adds a block', () => {
    const created = blockStore.dispatch(actions.blockCreate());
    const inStore = blockStore.getState().blocks[created.id];

    expect(inStore).to.eql(created);
  });

  describe('Sequence', () => {
    it('blockSetSequence() sets the length', () => {
      const sequence = 'acgtacgtacgt';
      blockStore.dispatch(actions.blockSetSequence(storeBlock.id, sequence))
        .then(() => {
          const newBlock = blockStore.getState().blocks[storeBlock.id];
          expect(newBlock.sequence.length).to.equal(sequence.length);
        });
    });

    it('blockSetSequence() validates the sequence');
  });

  describe.only('Orchestrator / Hierarchy', () => {
    before(() => {
      const root = storeBlock.id;
      range(5).reduce((parentId, index) => {
        const block = actions.blockCreate();
        actions.blockAddComponent(parentId, block.id);
        return block.id;
      }, root);

      console.log(blockStore.getState());
    });

    it('blockGetSiblings()', () => {

    });

    it('blockGetParents()', () => {

    });

    it('blockGetIndex()', () => {

    });
  });
});
