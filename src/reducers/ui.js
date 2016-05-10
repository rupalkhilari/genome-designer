import { combineReducers } from 'redux';

import modals from './ui/modals';
import inspector from './ui/inspector';
import inventory from './ui/inventory';
import detailView from './ui/detailView';

export default combineReducers({
  modals,
  detailView,
  inspector,
  inventory,
});
