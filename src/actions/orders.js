import invariant from 'invariant';
import Order from '../models/Order';
import { getOrder, getOrders } from '../middleware/order';
import * as ActionTypes from '../constants/ActionTypes';
import * as undoActions from '../store/undo/actions';
import { pauseAction, resumeAction } from '../store/pausableStore';
import * as blockActions from './blocks';
import * as blockSelectors from '../selectors/blocks';
import * as projectActions from './projects';
import * as projectSelectors from '../selectors/projects';
import { merge, flatten, sampleSize, range, shuffle } from 'lodash';

export const orderList = (projectId) => {
  return (dispatch, getState) => {
    return getOrders(projectId)
      .then(ordersData => {
        const orders = ordersData.map(order => new Order(order));

        dispatch({
          type: ActionTypes.ORDER_STASH,
          orders,
        });
        return orders;
      });
  };
};

export const orderGet = (projectId, orderId) => {
  return (dispatch, getState) => {
    return getOrder(projectId, orderId)
      .then(orderData => {
        const order = new Order(orderData);

        dispatch({
          type: ActionTypes.ORDER_STASH,
          order,
        });
        return order;
      });
  };
};

//create an order with basic fields
export const orderCreate = (projectId, constructIds = [], parameters = {}) => {
  return (dispatch, getState) => {
    invariant(projectId, 'must pass project ID');

    invariant(Array.isArray(constructIds) && constructIds.length, 'must pass array of construct IDs to use in order');
    //make sure we have specs
    invariant(constructIds.every(id => dispatch(blockSelectors.blockIsSpec(id))), 'all constructs must be specs (no empty option lists, and each leaf node must have a sequence)');

    invariant(typeof parameters === 'object', 'paramaters must be object');
    invariant(!Object.keys(parameters).length || Order.validateParameters(parameters), 'parameters must pass validation if you pass them in on creation');

    const numberCombinations = constructIds.reduce((acc, constructId) => acc + dispatch(blockSelectors.blockGetNumberCombinations(constructId, false)), 0);

    const order = new Order({
      projectId,
      constructIds,
      parameters,
      numberCombinations,
    });

    //add order to the store
    dispatch({
      type: ActionTypes.ORDER_CREATE,
      order,
    });

    //generate constructs and return
    const orderWithConstructs = dispatch(orderGenerateConstructs(order.id)); //eslint-disable-line no-use-before-define

    return orderWithConstructs;
  };
};

//should only call after parameters have been set
export const orderGenerateConstructs = (orderId) => {
  return (dispatch, getState) => {
    const oldOrder = getState().orders[orderId];
    const { constructIds, parameters } = oldOrder;
    invariant(Order.validateParameters(parameters), 'parameters must pass validation');

    //for each constructId, get construct combinations as blocks
    //flatten all combinations into a single list of combinations
    const combinations = flatten(constructIds.map(constructId => dispatch(blockSelectors.blockGetCombinations(constructId, true))));

    const allConstructs = combinations.map((construct, index) => ({
      index,
      active: true,
      componentIds: construct,
    }));

    if (!parameters.onePot && parameters.permutations < allConstructs.length) {
      if (parameters.combinatorialMethod === 'Maximum Unique Set') {
        //this may not be the most exlucsive set.... should actually think through this (and dependent on how generated)
        //also not exact, so trim to make sure correct length
        //todo - verify this yields the correct number
        allConstructs.forEach((el, idx, arr) => {
          el.active = (idx % Math.floor(allConstructs.length / parameters.permutations) === 0);
        });
      } else {
        //map of indices to keep
        const keepers = shuffle(range(allConstructs.length))
          .slice(0, parameters.permutations)
          .reduce((acc, idx) => Object.assign(acc, {[idx]: true}), {});

        allConstructs.forEach((el, idx, arr) => {
          el.active = keepers[idx] === true;
        });
      }
    }

    const order = oldOrder.setConstructs(allConstructs);

    dispatch({
      type: ActionTypes.ORDER_STASH,
      order,
    });
    return order;
  };
};

export const orderSetParameters = (orderId, parameters = {}, shouldMerge = false) => {
  return (dispatch, getState) => {
    const oldOrder = getState().orders[orderId];
    const order = oldOrder.setParameters(parameters, shouldMerge);

    //validate afterwards in case merging
    invariant(Order.validateParameters(order.parameters), 'parameters must pass validation');

    dispatch({
      type: ActionTypes.ORDER_STASH,
      order,
    });

    return dispatch(orderGenerateConstructs(orderId));
  };
};

export const orderSetName = (orderId, name) => {
  return (dispatch, getState) => {
    const oldOrder = getState().orders[orderId];
    const order = oldOrder.setName(name);

    dispatch({
      type: ActionTypes.ORDER_SET_NAME,
      order,
    });
    return order;
  };
};

//submit the order, foundry information is required
//actually saves the order to the server
export const orderSubmit = (orderId, foundry) => {
  return (dispatch, getState) => {
    const retrievedOrder = getState().orders[orderId];
    invariant(retrievedOrder, 'order not in the store...');
    invariant(!retrievedOrder.isSubmitted(), 'Cant submit an order twice');

    return retrievedOrder.submit(foundry)
      .then(orderData => {
        const order = new Order(orderData);

        dispatch(pauseAction());
        dispatch(undoActions.transact());

        //todo - the order is also frozen on the server... maybe we should just send + save the project...
        order.constructIds.forEach(constructId => dispatch(blockActions.blockFreeze(constructId, true)));

        dispatch({
          type: ActionTypes.PROJECT_SNAPSHOT,
          projectId: order.projectId,
          sha: order.projectVersion,
        });

        dispatch({
          type: ActionTypes.ORDER_SUBMIT,
          order,
        });

        dispatch(undoActions.commit());
        dispatch(resumeAction());

        return order;
      });
  };
};

export const orderDetach = (orderId) => {
  return (dispatch, getState) => {
    const order = getState().orders[orderId];

    invariant(!order.isSubmitted(), 'cannot delete a submitted order');

    dispatch({
      type: ActionTypes.ORDER_DETACH,
      orderId,
    });
    return orderId;
  };
};
