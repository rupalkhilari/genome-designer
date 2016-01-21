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

  describe('Orchestrator / Hierarchy', () => {
    //in before(), create a tree, where the initial block is the root, with a single lineage, where each node has multiple sibling
    const depth = 5;
    const siblings = 3;
    const root = storeBlock.id;
    const lineage = [root];
    let leaf;

    before(() => {
      leaf = range(depth).reduce((parentId, index) => {
        const blockIds = range(siblings).map(() => {
          const block = blockStore.dispatch(actions.blockCreate());
          blockStore.dispatch(actions.blockAddComponent(parentId, block.id));
          return block.id;
        });

        const procreator = blockIds[0];
        lineage.push(procreator);

        return procreator;
      }, root);
    });

    it('blockGetParents()', () => {
      const parents = blockStore.dispatch(actions.blockGetParents(leaf));

      expect(parents.length).to.equal(depth);
    });

    it('blockGetSiblings()', () => {
      const sibs = blockStore.dispatch(actions.blockGetSiblings(leaf));
      expect(sibs.length).to.equal(siblings);

      const parents = blockStore.dispatch(actions.blockGetParents(leaf));
      const parentId = parents[0];
      const parent = blockStore.getState().blocks[parentId];
      expect(parent.components).to.eql(sibs);
    });

    it('blockGetIndex()', () => {
      const index = blockStore.dispatch(actions.blockGetIndex(leaf));
      expect(index).to.equal(0);

      const parents = blockStore.dispatch(actions.blockGetParents(leaf));
      const parentId = parents[0];
      const parent = blockStore.getState().blocks[parentId];
      expect(parent.components[0]).to.eql(leaf);
    });
  });
});
