import chai from 'chai';
import * as types from '../../src/constants/ActionTypes';
import * as actions from '../../src/actions/inventory';
import { dispatch } from '../../src/store/index';
const { expect } = chai;

describe('inventory actions', () => {
  it('inventorySearch -> INVENTORY_SEARCH action', () => {
    expect(dispatch(actions.inventorySearch('blah'))).to.equal('blah');
  });

  it('inventoryToggleVisiblity -> INVENTORY_TOGGLE_VISIBILITY action', () => {
    expect(dispatch(actions.inventoryToggleVisibility(true))).to.equal(true);
  });
});
