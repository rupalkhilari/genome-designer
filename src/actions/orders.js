import invariant from 'invariant';
import Order from '../models/Order';
import { createOrder } from '../middleware/order';
import * as ActionTypes from '../constants/ActionTypes';
import * as projectActions from './projects';
import * as blockActions from './blocks';
import * as projectSelectors from '../selectors/projects';
import * as blockSelectors from '../selectors/blocks';
import { flatten } from 'lodash';

//create an order, without saving it.
export const orderCreate = (projectId, constructIds = [], parameters = {}) => {
  return (dispatch, getState) => {
    invariant(projectId, 'must pass project ID');

    invariant(Array.isArray(constructIds) && constructIds.length, 'must pass array of construct IDs to use in order');
    //make sure we have specs
    invariant(constructIds.every(id => dispatch(blockSelectors.blockIsSpec(id))), 'all constructs must be specs (no empty option lists, and each leaf node must have a sequence)');

    invariant(typeof parameters === 'object', 'paramters must be object');

    const order = new Order(projectId, {
      constructIds,
      parameters,
    });

    //add order to the store
    dispatch({
      type: ActionTypes.ORDER_CREATE,
      order,
    });
    return order;
  };
};

export const orderSetParameters = (orderId, parameters = {}, shouldMerge) => {
  return (dispatch, getState) => {
    invariant(Order.validateParameters(parameters), 'parameters must pass validation');

    const oldOrder = getState().orders[orderId];
    const order = oldOrder.setParameters(parameters, shouldMerge);

    dispatch({
      type: ActionTypes.ORDER_STASH,
      order,
    });
    return order;
  };
};

//todo - should be able to just get parameters form the order itself
export const orderGenerateConstructs = (orderId) => {
  return (dispatch, getState) => {
    const order = getState().orders[orderId];

    const { constructIds, parameters } = order;

    //for each constructId, get constructs
    return flatten(constructIds.map()); //todo
  };
};

//submit the order, foundry information is required
//actually saves the order to the server
export const orderSubmit = (orderId, foundry) => {
  return (dispatch, getState) => {
    const order = getState().orders[orderId];
    invariant(order, 'order not in the store...');
    invariant(!order.isSubmitted(), 'Cant submit an order twice');

    return order.submit(foundry)
      .then(order => {
        //update store
        dispatch({
          type: ActionTypes.ORDER_SUBMIT,
          order,
        });
      });
  };
};
