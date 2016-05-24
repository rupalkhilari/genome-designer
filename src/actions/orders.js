import invariant from 'invariant';
import Order from '../models/Order';
import { createOrder } from '../middleware/order';
import * as ActionTypes from '../constants/ActionTypes';
import * as projectActions from './projects';
import * as blockActions from './blocks';
import * as projectSelectors from '../selectors/projects';
import * as blockSelectors from '../selectors/blocks';

//todo - determine where order is created, where its saved, etc... clean up this flow

export const orderCreate = (projectId, parameters = {}, constructIds = []) => {
  return (dispatch, getState) => {
    invariant(projectId, 'must pass project ID');

    invariant(Array.isArray(constructIds) && constructIds.length, 'must pass array of construct IDs to use in order');
    //make sure we have specs
    invariant(constructIds.every(id => dispatch(blockSelectors.blockIsSpec(id))), 'all constructs must be specs (no empty option lists, and each leaf node must have a sequence)');

    invariant(typeof parameters === 'object', 'paramters must be object');
    invariant(Order.validateParameters(parameters), 'parameters must pass validation');

    //snapshot project with message noting order
    return dispatch(projectActions.projectSnapshot(projectId, 'order'))
    //get new project version
      .then(sha => {
        //create order with ID + version
        const order = new Order(projectId, sha, {
          constructIds,
          parameters,
        });

        //todo - should this be order model function?
        return createOrder(projectId, order)
          .then(resp => {
            //add order to the store
            dispatch({
              type: ActionTypes.ORDER_CREATE,
              order,
            });

            return order;
          });
      });
  };
};

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
      })
  };
};
