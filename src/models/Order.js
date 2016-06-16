import invariant from 'invariant';
import InstanceSchema from '../schemas/Instance';
import { set as pathSet, merge, cloneDeep } from 'lodash';
import OrderDefinition from '../schemas/Order';
import OrderParametersSchema from '../schemas/OrderParameters';
import OrderConstructSchema from '../schemas/OrderConstruct';
import * as validators from '../schemas/fields/validators';
import safeValidate from '../schemas/fields/safeValidate';
import { submitOrder, getQuote } from '../middleware/order';

const idValidator = (id) => safeValidate(validators.id(), true, id);

//due to issues with freezing, not extending Instance. This is a hack. Ideally, could have InstanceUnfrozen schema or something to extend
export default class Order  {
  constructor(input = {}) {
    invariant(input.projectId, 'project Id is required to make an order');

    //lets not deep freeze these
    merge(
      this,
      InstanceSchema.scaffold(),
      OrderDefinition.scaffold(),
      input,
    );
  }

  /************
   constructors etc.
   ************/

  //return an unfrozen JSON, no instance methods
  static classless(input) {
    return Object.assign({}, cloneDeep(new Order(input)));
  }

  //validate a complete order (with a project ID, which is after submission)
  static validate(input, throwOnError = false) {
    return OrderDefinition.validate(input, throwOnError);
  }

  //validate order prior to submission - should have parameters, constructs, user, projectId
  static validateSetup(input, throwOnError = false) {
    return idValidator(input.projectId) &&
      input.constructIds.length > 0 &&
      input.constructIds.every(id => idValidator(id)) &&
      input.constructs.length > 0 &&
      input.constructs.every(construct => OrderConstructSchema.validate(construct)) &&
      OrderParametersSchema.validate(input.parameters, throwOnError);
  }

  static validateParameters(input, throwOnError = false) {
    return OrderParametersSchema.validate(input, throwOnError);
  }

  clone() {
    invariant(false, 'cannot clone an order');
  }

  mutate(path, value) {
    return pathSet(this, path, value);
  }

  merge(toMerge) {
    return merge(this, toMerge);
  }

  /************
   metadata etc
   ************/

  getName() {
    return this.metadata.name || 'Untitled Order';
  }

  setName(newName) {
    return this.mutate('metadata.name', newName);
  }

  isSubmitted() {
    return this.status.foundry && this.status.remoteId;
  }

  dateSubmitted() {
    return this.isSubmitted() ? this.status.timeSent : null;
  }

  /************
   parameters, user, other information
   ************/

  setParameters(parameters = {}, shouldMerge = false) {
    const nextParameters = merge({}, (shouldMerge === true ? cloneDeep(this.parameters) : {}), parameters);
    // invariant(OrderParametersSchema.validate(parameters, false), 'parameters must pass validation');
    return this.merge({ parameters: nextParameters });
  }

  /************
   constructs + filtering
   ************/

  setConstructs(constructs = []) {
    invariant(Array.isArray(constructs), 'must pass an array of constructs');
    //validation takes a long time, ignore for now...
    //invariant(constructs.every(construct => OrderConstructSchema.validate(construct)), 'must pass valid constructs. See OrderConstruct schema');

    console.time('mutate');
    const mutated = this.mutate('constructs', constructs);
    console.timeEnd('mutate');
    return mutated;
  }

  constructsAdd(...constructs) {
    //todo - update to expect ID
  }

  constructsRemove(...constructs) {
    //todo - update to expect ID
  }

  /************
   quote + submit
   ************/

  quote(foundry) {
    return getQuote(foundry, this);
  }

  submit(foundry) {
    //may want to just set the foundry on the order directly?
    return submitOrder(this, foundry);
  }
}
