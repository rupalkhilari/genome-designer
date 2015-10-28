import fields, { validators } from './fields';

/*
An Inventory is a foundry / freezer / storage facility, the location where e.g. a part is sourced

//todo - what else do we need?
*/

const InventorySchema = {
  id      : validators.id().isRequired,
  metadata: validators.shape({
    authors    : validators.arrayOf(validators.id()).isRequired,
    version    : validators.version().isRequired,             //do we want to use this e.g. for caching purposes? or just store a date?
    tags       : validators.object().isRequired,
    name       : validators.string(),
    description: validators.string()
  }).isRequired,

  url: validators.url()
};

export default InventorySchema;