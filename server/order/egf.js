import { errorInvalidPart, errorOrderRejected } from '../utils/errors';
import rejectingFetch from '../../src/middleware/rejectingFetch';
import { headersPost } from '../../src/middleware/headers';

//testing
import { fileWrite } from '../utils/fileSystem';

const url = 'http://synnp.org:8010/';

export const submit = (order, user) => {
  //for now, only accept EGF Parts -- need to relay this to the client
  if (!order.constructs.every(construct => construct.components.every(component => component.source.source === 'egf'))) {
    return Promise.reject(errorInvalidPart);
  }

  const constructs2d = order.constructs.map(orderConstruct => orderConstruct.components.map(component => component.source.id));

  const payload = {
    orderId: order.id,
    constructs: constructs2d,
    customer: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };

  //testing
  fileWrite('storage/test/lastOrder.json', payload);

  const stringified = JSON.stringify(payload);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json())
    .then(response => {
      if (!(response.success === true || response.success === 'true')) {
        console.log(response);
        return Promise.reject(errorOrderRejected);
      }

      console.log('got response from EGF:');
      console.log(response);

      // todo - convert response to this format minimally
      return Promise.resolve({
        jobId: 'somejob',
        cost: 100.45,
      });
    });
};
