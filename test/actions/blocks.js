import { expect } from 'chai';
import sha1 from 'sha1';
import * as actions from '../../src/actions/blocks';
import blocksReducer from '../../src/reducers/blocks';
import { simpleStore } from '../store/mocks';
import Block from '../../src/models/Block';

describe('Block Actions', () => {
  const storeBlock = new Block();
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
    [storeBlock.id]: storeBlock,
    [root.id]: root,
    [childA.id]: childA,
    [childB.id]: childB,
    [grandchildA1.id]: grandchildA1,
    [grandchildA2.id]: grandchildA2,
  };
  const blockStore = simpleStore(cloneStoreInitial, blocksReducer, 'blocks');

  it('blockCreate() adds a block', () => {
    const created = blockStore.dispatch(actions.blockCreate());
    const inStore = blockStore.getState().blocks[created.id];

    expect(inStore).to.eql(created);
  });

  describe('Cloning', () => {
    it('blockClone() errors when not passed a project version', () => {
      expect(() => blockStore.dispatch(actions.blockClone(storeBlock.id))).to.throw();
    });

    it('blockClone() clones a block with a new id + proper parents', () => {
      const projectVersion = sha1('someProject');
      const clone = blockStore.dispatch(actions.blockClone(storeBlock.id, projectVersion));
      expect(clone.id).to.not.equal(storeBlock.id);
      expect(clone.parents).to.eql([{
        id: storeBlock.id,
        sha: projectVersion,
      }]);

      const comparable = Object.assign({}, clone, {
        id: storeBlock.id,
        parents: [],
      });
      expect(comparable).to.eql(storeBlock);
    });

    it('blockClone() deep clones by default, and updates children IDs', () => {
      const projectVersion = sha1('someProject');
      const storePreClone = blockStore.getState().blocks;
      const rootClone = blockStore.dispatch(actions.blockClone(root.id, projectVersion));
      const stateAfterClone = blockStore.getState().blocks;

      expect(Object.keys(storePreClone).length + 5).to.equal(Object.keys(stateAfterClone).length);
      expect(rootClone.parents).to.eql([{
        id: root.id,
        sha: projectVersion,
      }]);

      const children = rootClone.components.map(componentId => stateAfterClone[componentId]);
      const cloneA = children[0];
      expect(cloneA.parents).to.eql([{
        id: childA.id,
        sha: projectVersion,
      }]);
      expect(cloneA.components.length).to.equal(2);

      const grandchildren = cloneA.components.map(componentId => stateAfterClone[componentId]);
      expect(grandchildren[0].parents).to.eql([{
        id: grandchildA1.id,
        sha: projectVersion,
      }]);
    });

    it('blockClone() can shallow clone', () => {
      const projectVersion = sha1('someProject');
      const preClone = blockStore.getState().blocks;
      const rootClone = blockStore.dispatch(actions.blockClone(root.id, projectVersion, true));
      const postClone = blockStore.getState().blocks;

      expect(Object.keys(preClone).length + 1).to.equal(Object.keys(postClone).length);

      expect(rootClone.components).to.eql(root.components);
    });
  });

  describe('Sequence', () => {
    const sequence = 'acgtacgtacgt';

    it('blockSetSequence() sets the length', () => {
      blockStore.dispatch(actions.blockSetSequence(storeBlock.id, sequence))
        .then(() => {
          const newBlock = blockStore.getState().blocks[storeBlock.id];
          expect(newBlock.sequence.length).to.equal(sequence.length);
        });
    });

    it('blockSetSequence() validates the sequence');
  });
});
