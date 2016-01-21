import { dispatch } from '../store/index';
import * as rawActions from '../actions/blocks';
import * as rawSelectors from '../selectors/blocks';
import mapValues from '../utils/object/mapValues';

const dispatchWrapper = (action) => (...args) => dispatch(action(...args));

const actions = mapValues(rawActions, dispatchWrapper);
const selectors = mapValues(rawSelectors, dispatchWrapper);

export default {
  ...actions,
  ...selectors,
};
