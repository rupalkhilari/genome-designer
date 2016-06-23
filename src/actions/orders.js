import invariant from 'invariant';
import Order from '../models/Order';
import { getOrder, getOrders } from '../middleware/order';
import * as ActionTypes from '../constants/ActionTypes';
import * as undoActions from '../store/undo/actions';
import { pauseAction, resumeAction } from '../store/pausableStore';
import * as blockActions from './blocks';
import * as blockSelectors from '../selectors/blocks';
import { cloneDeep, merge, flatten, sampleSize, range, shuffle } from 'lodash';
import * as instanceMap from '../store/instanceMap';

export const orderList = (projectId, avoidCache = false) => {
  return (dispatch, getState) => {
    const cached = instanceMap.projectOrdersLoaded(projectId);
    if (cached && avoidCache !== true) {
      return Promise.resolve(instanceMap.getProjectOrders(projectId));
    }

    return getOrders(projectId)
      .then(ordersData => {
        const orders = ordersData.map(order => new Order(order));

        instanceMap.saveProjectOrders(projectId, ...orders);

        dispatch({
          type: ActionTypes.ORDER_STASH,
          orders,
        });
        return orders;
      });
  };
};

export const orderGet = (projectId, orderId, avoidCache = false) => {
  return (dispatch, getState) => {
    const cached = instanceMap.orderLoaded(orderId);

    if (cached && avoidCache !== true) {
      return Promise.resolve(instanceMap.getOrder(orderId));
    }

    return getOrder(projectId, orderId)
      .then(orderData => {
        const order = new Order(orderData);

        instanceMap.saveOrder(order);

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

    return order;
  };
};

//parameters must be valid. returns an array with the generated constructs, does not affect the order itself.
//todo - selector
//todo - ensure this code (generating constructs from order + rollup) is shared between client and server
export const orderGenerateConstructs = (orderId, allPossibilities = false) => {
  return (dispatch, getState) => {
    const state = getState();
    const order = state.orders[orderId];
    const { projectId, constructIds, parameters } = order;
    invariant(Order.validateParameters(parameters), 'parameters must pass validation');

    //for each constructId, get construct combinations as blocks
    //flatten all combinations into a single list of combinations
    const combinations = flatten(constructIds.map(constructId => dispatch(blockSelectors.blockGetCombinations(constructId, true))));

    if (!order.onlySubset() || allPossibilities === true) {
      return combinations;
    }

    return combinations.filter((el, idx, arr) => parameters.activeIndices[idx] === true);
  };
};

export const orderSetParameters = (orderId, inputParameters = {}, shouldMerge = false) => {
  return (dispatch, getState) => {
    const oldOrder = getState().orders[orderId];
    const parameters = shouldMerge ? merge(cloneDeep(oldOrder.parameters), inputParameters) : inputParameters;

    const { numberCombinations } = oldOrder;
    if (!parameters.onePot && parameters.permutations < numberCombinations) {
      const keepers = (parameters.combinatorialMethod === 'Maximum Unique Set')
        ?
        range(numberCombinations.length)
          .map(idx => idx % Math.floor(numberCombinations / parameters.permutations) === 0)
        :
        shuffle(range(numberCombinations))
          .slice(0, parameters.permutations);

      const map = keepers.reduce((acc, idx) => Object.assign(acc, { [idx]: true }), {});

      parameters.activeIndices = map;
    }

    if (parameters.onePot) {
      parameters.sequenceAssemblies = false;
    }

    invariant(Order.validateParameters(parameters), 'parameters must pass validation');
    const order = oldOrder.setParameters(parameters);

    dispatch({
      type: ActionTypes.ORDER_SET_PARAMETERS,
      order,
    });
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

    const positionalCombinations = retrievedOrder.constructIds.reduce((acc, constructId) => {
      return Object.assign(acc, { [constructId]: dispatch(blockSelectors.blockGetPositionalCombinations(constructId, true)) });
    }, {});

    return retrievedOrder.submit(foundry, positionalCombinations)
      .then(orderData => {
        const order = new Order(orderData);

        dispatch(pauseAction());
        dispatch(undoActions.transact());

        //todo - the order is also frozen on the server... this is for parity. maybe we should just send + save the project...
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
