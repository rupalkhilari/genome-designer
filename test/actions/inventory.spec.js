import chai from 'chai';
import * as types from '../../src/constants/ActionTypes';
import * as actions from '../../src/actions/inventory';

const { expect } = chai;

describe('inventory actions', () => {
  it('inventorySearch -> INVENTORY_SEARCH action', () => {
    expect(actions.inventorySearch('blah')).to.eql({
      type: types.INVENTORY_SEARCH,
      searchTerm: 'blah',
    });
  });

  it('inventoryToggleVisiblity -> INVENTORY_TOGGLE_VISIBILITY action', () => {
    expect(actions.inventoryToggleVisibility(true)).to.eql({
      type: types.INVENTORY_TOGGLE_VISIBILITY,
      forceState: true,
    });
  });
});
