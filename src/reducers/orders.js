import * as ActionTypes from '../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';
import * as instanceMap from '../store/instanceMap';

export const initialState = {};

export default function orders(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.ORDER_CREATE:
  case ActionTypes.ORDER_STASH:
  case ActionTypes.ORDER_SET_PARAMETERS:
  case ActionTypes.ORDER_SUBMIT:
  case ActionTypes.ORDER_SET_NAME:
    const { order, orders } = action;
    if (Array.isArray(orders)) {
      instanceMap.saveOrder(...orders);
      const toMerge = orders.reduce((acc, order) => Object.assign(acc, { [order.id]: order }), {});
      return Object.assign({}, state, toMerge);
    }

    instanceMap.saveOrder(order);
    return Object.assign({}, state, { [order.id]: order });

  case ActionTypes.ORDER_DETACH :
    const { orderId } = action;
    const clone = Object.assign({}, state);
    delete clone[orderId];
    instanceMap.removeOrder(orderId);
    return clone;

  case ActionTypes.USER_SET_USER :
    return Object.assign({}, initialState);

  default:
    return state;
  }
}
