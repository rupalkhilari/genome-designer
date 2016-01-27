import { expect } from 'chai';
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

  describe.only('Cloning', () => {
    const grandchildA1 = new Block();
    const grandchildA2 = new Block();
    const childA = new Block({
      components: [grandchildA1.id, grandchildA2.id],
    });
    const childB = new Block();
    const root = new Block({
      components: [childA.id, childB.id],
    });
    const cloneStoreInitial = {
      [root.id]: root,
      [childA.id]: childA,
      [childB.id]: childB,
      [grandchildA1.id]: grandchildA1,
      [grandchildA2.id]: grandchildA2,
    };
    const cloningStore = simpleStore(cloneStoreInitial, blocksReducer, 'blocks');

    it('blockClone() clones a block with a new id + proper parents', () => {
      const clone = blockStore.dispatch(actions.blockClone(storeBlock.id));
      expect(clone.id).to.not.equal(storeBlock.id);
      expect(clone.parents).to.eql([storeBlock.id]);

      const comparable = Object.assign({}, clone, {
        id: storeBlock.id,
        parents: [],
      });
      expect(comparable).to.eql(storeBlock);
    });

    it('blockClone() deep clones by default, and updates children IDs', () => {
      const storePreClone = cloningStore.getState().blocks;
      const rootClone = cloningStore.dispatch(actions.blockClone(root.id));
      const stateAfterClone = cloningStore.getState().blocks;

      expect(Object.keys(storePreClone).length * 2).to.equal(Object.keys(stateAfterClone).length);
      expect(rootClone.parents).to.eql([root.id]);

      const children = rootClone.components.map(componentId => stateAfterClone[componentId]);
      const cloneA = children[0];
      expect(cloneA.parents).to.eql([childA.id]);
      expect(cloneA.components.length).to.equal(2);

      const grandchildren = cloneA.components.map(componentId => stateAfterClone[componentId]);
      expect(grandchildren[0].parents).to.eql([grandchildA1.id]);
    });

    it('blockClone() can shallow clone', () => {
      const preClone = cloningStore.getState().blocks;
      const rootClone = cloningStore.dispatch(actions.blockClone(root.id, true));
      const postClone = cloningStore.getState().blocks;

      expect(Object.keys(preClone).length + 1).to.equal(Object.keys(postClone).length);

      expect(rootClone.components).to.eql(root.components);
    });
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
});
