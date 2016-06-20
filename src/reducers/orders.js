import * as ActionTypes from '../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';

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
      const toMerge = orders.reduce((acc, order) => Object.assign(acc, { [order.id]: order }), {});
      return Object.assign({}, state, toMerge);
    }
    return Object.assign({}, state, { [order.id]: order });

  case ActionTypes.ORDER_DETACH :
    const { orderId } = action;
    const clone = Object.assign({}, state);
    delete clone[orderId];
    return clone;

  case ActionTypes.USER_SET_USER :
    return Object.assign({}, initialState);
  
  default:
    return state;
  }
}
