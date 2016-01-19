import chai from 'chai';
import * as actions from '../../src/actions/blocks';
import blocksReducer from '../../src/reducers/blocks';
import { simpleStore } from '../store/mocks';
import Block from '../../src/models/Block';

const { expect } = chai;

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

  it('blockSetSequence() sets the length', () => {
    const sequence = 'acgtacgtacgt';
    blockStore.dispatch(actions.blockSetSequence(storeBlock.id, sequence));
    const newBlock = blockStore.getState().blocks[storeBlock.id];
    expect(newBlock.sequence.length).to.equal(sequence.length);
  });
});
