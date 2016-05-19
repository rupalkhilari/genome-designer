import invariant from 'invariant';
import { merge } from 'lodash';
import OrderDefinition from '../schemas/Order';
import * as ActionTypes from '../constants/ActionTypes';

export const orderCreate = (projectId, parameters) => {
  return (dispatch, getState) => {
    invariant(false, 'not ready yet');

    //snapshot project with message noting order
    //get new project version
    //create order with ID + version
    //validate
    //add to store
    //save order on server
    //return order
  };
};
