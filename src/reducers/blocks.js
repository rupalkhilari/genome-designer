import * as ActionTypes from '../constants/ActionTypes';
import dummyBlocks from '../inventory/andrea';
import exampleWithAnnotations from '../inventory/examples/exampleWithAnnotations';

//import fs from 'fs';

//testing
import Block from '../models/Block';

//testing, default should be {} (but need to hydrate to models)
//const [child1, child2, child3, child4, child5] = dummyBlocks;
const [child1, child2, child3, child4, child5, child6, child7] = dummyBlocks;
const withAnnotations = new Block(exampleWithAnnotations);

const initialState = {
  block1: new Block({
    id: 'block1',
    components: [withAnnotations.id, child1.id, child2.id, child3.id],
  }),
  block2: new Block({
    id: 'block2',
    components: [],
  }),
  [withAnnotations.id]: withAnnotations,
  [child1.id]: new Block(child1),
  [child2.id]: new Block(Object.assign({}, child2, {
    components: [child4.id, child5.id],
  })),
  [child3.id]: new Block(child3),
  [child4.id]: new Block(Object.assign({}, child4)),
  [child5.id]: new Block(Object.assign({}, child5, {
    components: [child6.id, child7.id],
  })),
  [child6.id]: new Block(Object.assign({}, child6)),
  [child7.id]: new Block(Object.assign({}, child7)),
};

const project_and_blocks = require('../../storage/imported_from_genbank.json');

const floBlockState = project_and_blocks.blocks;
var floState = [];
for (var id in floBlockState) {
  floState.push(new Block(floBlockState[id]));
}

var floState = {};
for (var id in floBlockState) {
  floState[id] = new Block(floBlockState[id]);
}

export default function blocks(state = floState, action) {

//export default function blocks(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.BLOCK_CREATE :
  //case ActionTypes.BLOCK_SAVE :
  case ActionTypes.BLOCK_LOAD :
  case ActionTypes.BLOCK_MERGE :
  case ActionTypes.BLOCK_RENAME :
  case ActionTypes.BLOCK_SET_COLOR :
  case ActionTypes.BLOCK_CLONE :
  case ActionTypes.BLOCK_SET_SBOL :
  case ActionTypes.BLOCK_ANNOTATE :
  case ActionTypes.BLOCK_REMOVE_ANNOTATION :
  case ActionTypes.BLOCK_SET_SEQUENCE :
  case ActionTypes.BLOCK_COMPONENT_ADD :
  case ActionTypes.BLOCK_COMPONENT_MOVE :
  case ActionTypes.BLOCK_COMPONENT_REMOVE : {
    const { block } = action;
    return Object.assign({}, state, {[block.id]: block});
  }
  case ActionTypes.BLOCK_DELETE : {
    const { blockId } = action;
    const nextState = Object.assign({}, state);
    delete nextState[blockId];
    return nextState;
  }
  default : {
    return state;
  }
  }
}
