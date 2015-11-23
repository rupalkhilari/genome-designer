import React from 'react';
import TestUtils from 'react-addons-test-utils';
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
  //const store = configureStore(initialState);

  const props = Object.assign({
    inventorySearch: sinon.spy(),
    inventoryToggleVisibility: sinon.spy(),
    isVisible: false,
    searchTerm: '',
  }, propOverrides);

  const component = TestUtils.renderIntoDocument(
    <Inventory {...props} />
  );

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

      TestUtils.Simulate.click(component.refs.close);
      expect(toggleSpy).to.have.been.calledWith(false);
    });
  });
});
