import { errorInvalidPart, errorOrderRejected } from '../utils/errors';
import fetch from 'isomorphic-fetch';
import { headersPost } from '../../src/middleware/headers';

//testing
import { fileWrite } from '../utils/fileSystem';

const url = 'http://ec2-52-30-192-126.eu-west-1.compute.amazonaws.com:8010/api/order/';

export const submit = (order, user, blockMap) => {
  const constructsWithBlockComponents = order.constructs
    .filter(construct => construct.active)
    .map(orderConstruct => orderConstruct.componentIds.map(componentId => blockMap[componentId]));

  //console.log(blockMap);
  //console.log(order.constructs);
  //console.log(constructsWithBlockComponents);

  //for now, only accept EGF Parts -- need to relay this to the client
  if (!constructsWithBlockComponents.every(construct => construct.every(component => component.source.source === 'egf'))) {
    return Promise.reject(errorInvalidPart);
  }

  const constructs2d = constructsWithBlockComponents
    .map(constructWithComponents => constructWithComponents.map(block => block.source.id));

  const payload = {
    orderId: order.id,
    constructs: constructs2d,
    isCombinatorialMix: order.parameters.onePot,
    customer: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    validationOnly: true, //todo - if we want to actually allow orders, set to false
  };

  //testing
  fileWrite('storage/test/lastOrder.json', payload);

  const stringified = JSON.stringify(payload);

  return fetch(url, headersPost(stringified))
    .then(resp => resp.json())
    .then(response => {
      if (!(response.success === true || response.success === 'true')) {
        console.log(response);
        return Promise.reject(errorOrderRejected);
      }

      console.log('got response from EGF:');
      console.log(response);

      return Promise.resolve({
        jobId: `${response.egf_order_id}`,
        cost: `${response.estimated_price}`,
      });
    });
};
