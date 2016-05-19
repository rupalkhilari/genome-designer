import * as ActionTypes from '../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';
import invariant from 'invariant';

export const initialState = {};

export default function orders(state = initialState, action) {
  switch (action.type) {

  default:
    return state;
  }
}