import * as types from './validators';

/*
An Inventory is a foundry / freezer / storage facility, the location where e.g. a part is sourced

//todo - what else do we need?
*/

const InventorySchema = {
  id      : types.id().isRequired,
  metadata: types.shape({
    authors    : types.arrayOf(types.id()).isRequired,
    version    : types.version().isRequired,             //do we want to use this e.g. for caching purposes? or just store a date?
    tags       : types.object().isRequired,
    name       : types.string(),
    description: types.string()
  }).isRequired,

  url: types.url()
};

export default InventorySchema;