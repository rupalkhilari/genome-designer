/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import invariant from 'invariant';
import Instance from '../models/Instance';
import { merge, cloneDeep } from 'lodash';
import OrderDefinition from '../schemas/Order';
import OrderParametersSchema from '../schemas/OrderParameters';
import * as validators from '../schemas/fields/validators';
import safeValidate from '../schemas/fields/safeValidate';
import { submitOrder, getQuote } from '../middleware/order';

const idValidator = (id) => safeValidate(validators.id(), true, id);

//due to issues with freezing, not extending Instance. This is a hack. Ideally, could have InstanceUnfrozen schema or something to extend
//NOTE that orders are not immutable because this can be very expensive when they are large. Note that this affects rendering in React
export default class Order extends Instance {
  constructor(input = {}) {
    invariant(input.projectId, 'project Id is required to make an order');
    invariant(input.constructIds, 'constructIDs are required on creation for generating number of constructs');

    super(input, OrderDefinition.scaffold());
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
      OrderParametersSchema.validate(input.parameters, throwOnError);
  }

  static validateParameters(input, throwOnError = false) {
    return OrderParametersSchema.validate(input, throwOnError);
  }

  clone() {
    invariant(false, 'cannot clone an order');
  }

  mutate(path, value) {
    invariant(!this.isSubmitted(), 'cannot change a submitted order');
    return super.mutate(path, value);
  }

  merge(...args) {
    invariant(!this.isSubmitted(), 'cannot change a submitted order');
    return super.merge(...args);
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

  setParameters(parameters = {}) {
    invariant(OrderParametersSchema.validate(parameters, false), 'parameters must pass validation');
    return this.mutate('parameters', parameters);
  }

  onlySubset() {
    const { parameters } = this;
    return (!parameters.onePot && parameters.permutations < this.numberCombinations);
  }

  /************
   quote + submit
   ************/

  quote(foundry) {
    return getQuote(foundry, this);
  }

  submit(foundry, positionalCombinations) {
    //may want to just set the foundry on the order directly?
    return submitOrder(this, foundry, positionalCombinations);
  }
}
