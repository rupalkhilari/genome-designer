import React from 'react';
import { Provider } from 'react-redux';
import TestUtils from 'react-addons-test-utils';
import wrapInDragTestContext from '../utils/wrapInDragTestContext';
import { createStore } from 'redux';
import rootReducer from '../../src/reducers/index';
import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

/*
 import { Provider } from 'react-redux';
 import App from '../../src/containers/App';
 import configureStore from '../../src/store/configureStore';
 */

import InventoryConnected, { Inventory } from '../../src/containers/Inventory';

function setup(propOverrides = {}) {
  const store = createStore(rootReducer);

  const props = Object.assign({
    inventorySearch: sinon.spy(),
    inventoryToggleVisibility: sinon.spy(),
    isVisible: false,
    searchTerm: '',
  }, propOverrides);

  // Render with the testing backend
  const InventoryDragContext = wrapInDragTestContext(Inventory);
  const component = TestUtils.renderIntoDocument(<Provider store={store}><InventoryDragContext {...props} /></Provider>);

  return {
    props,
    component,
  };
}

describe('containers', () => {
  describe('Inventory', () => {
    it('clicking close button', () => {
      const toggleSpy = sinon.spy();
      const {component, props} = setup({
        isVisible: true,
        inventoryToggleVisibility: toggleSpy,
      });

      expect(props.isVisible).to.equal(true);

      //wrapping will break component refs
      const closeButton = TestUtils.findRenderedDOMComponentWithClass(component, 'SidePanel-close');

      TestUtils.Simulate.click(closeButton);
      expect(toggleSpy).to.have.been.calledWith(false);
    });
  });
});
