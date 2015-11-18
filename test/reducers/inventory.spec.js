import chai from 'chai';
import * as types from '../../src/constants/ActionTypes';
import inventory, { initialState } from '../../src/reducers/inventory';

const { expect } = chai;

describe('inventory reducers', () => {
  it('have a defined initial state', () => {
    expect(inventory(undefined, {})).to.eql(initialState);

    expect(initialState).to.eql({
      isVisible: false,
      searchTerm: '',
    });
  });

  it('accept initial state', () => {
    expect(inventory(initialState, {})).to.eql(initialState);
  });

  it('should handle INVENTORY_SEARCH', () => {
    expect(inventory(initialState, {
      type: types.INVENTORY_SEARCH,
      searchTerm: 'woohoo',
    })).to.eql(Object.assign({}, initialState, {
      searchTerm: 'woohoo',
    }));
  });
});
