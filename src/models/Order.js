import Instance from './Instance';
import invariant from 'invariant';
import cloneDeep from 'lodash.clonedeep';
import OrderDefinition from '../schemas/Order';
import OrderParametersDefinition from '../schemas/OrderParameters';

export default class Order extends Instance {
  constructor(projectId, projectVersion, input = {}) {
    invariant(projectId, 'project is required to make an order');
    invariant(projectVersion, 'project version required to make an order');

    super(input, OrderDefinition.scaffold(), {
      projectId,
      projectVersion,
    });
  }

  /************
   constructors etc.
   ************/

  //return an unfrozen JSON, no instance methods
  static classless(input) {
    return Object.assign({}, cloneDeep(new Order(input)));
  }

  static validate(input, throwOnError = false) {
    return OrderDefinition.validate(input, throwOnError);
  }

  static validateParameters(input, throwOnError = false) {
    return OrderParametersDefinition.validate(input, throwOnError);
  }

  clone() {
    invariant('cannot clone an order');
  }

  /************
   metadata etc
   ************/

  setName(newName) {
    const renamed = this.mutate('metadata.name', newName);
    return renamed;
  }

  isSubmitted() {
    return this.status.foundry && this.status.remoteId;
  }

  /************
   quote + submit
   ************/

  quote(foundry) {

  }

  submit(foundry) {
    //set foundry + remote ID in status
  }

}
