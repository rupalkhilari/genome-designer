import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

//todo - refactor so each module is imported separately (like reducers)

//Adds a construct to a project
export const projectAddConstruct = makeActionCreator(ActionTypes.PROJECT_ADD_CONSTRUCT, 'id', 'construct');

export const projectCreate = makeActionCreator(ActionTypes.PROJECT_CREATE, 'name');

export const blockAddBlock = makeActionCreator(ActionTypes.BLOCK_ADD_BLOCK, 'block');

//updates the name of a part
export const partUpdateName = makeActionCreator(ActionTypes.PART_UPDATE_NAME, 'id', 'name');