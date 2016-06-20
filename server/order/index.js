import express from 'express';
import {
  errorNoIdProvided,
  errorInvalidModel,
  errorDoesNotExist,
  errorVersioningSystem,
} from './../utils/errors';
import { merge, flatten } from 'lodash';
import * as querying from './../data/querying';
import * as persistence from './../data/persistence';
import * as rollup from './../data/rollup';
import { permissionsMiddleware } from './../data/permissions';

import Order from '../../src/models/Order';
import { submit } from './egf';

const router = express.Router(); //eslint-disable-line new-cap

//in theory, we could get rid of this part of the route, and just assign the projectID basic on the project that is posted
router.param('projectId', (req, res, next, id) => {
  Object.assign(req, { projectId: id });
  next();
});

router.route('/:projectId/:orderId?')
  .all(permissionsMiddleware)
  .get((req, res, next) => {
    const { user, projectId } = req;
    const { orderId } = req.params;

    if (!!orderId) {
      return persistence.orderGet(orderId, projectId)
        .then(order => res.status(200).json(order))
        .catch(err => next(err));
    }

    return querying.getOrders(projectId)
      .then(orders => res.status(200).json(orders))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    const { user, projectId } = req;
    const { foundry, order, positionalCombinations } = req.body;

    if (projectId !== order.projectId) {
      return res.status(401).send('project ID and order.projectId must match');
    }

    //note - this expects order.id to be defined
    if (!Order.validateSetup(order)) {
      return next(errorInvalidModel);
    }

    if (foundry !== 'egf') {
      return res.status(501).send('foundry must be EGF');
    }

    console.log(`
Valid Order request
Order ID ${order.id}
Project ID ${order.projectId}
Constructs ${order.constructIds.join(', ')}
User ${user.uuid}
`);

    //assign user to the order
    merge(order, {
      user: user.uuid,
    });

    // outerscope, to assign to the order
    const constructNames = [];

    //NOTE - in future, need to do this based on the project version. For now, assume that only interested in the current state of the project.
    rollup.getProjectRollup(order.projectId)
      .then(projectRollup => {
        //create a map of all the blocks involved in the order
        return Promise.all(order.constructIds.map(constructId => rollup.getContentsRecursivelyGivenRollup(constructId, projectRollup)))
          .then(blockMaps => blockMaps.reduce((acc, map) => Object.assign(acc, map.components, map.options), {}))
          .then(blockMap => {
            constructNames.push(...order.constructIds.map(constructId => blockMap[constructId].metadata.name));
            return blockMap;
          });
      })
      .then(blockMap => {
        //todo - should share this logic with the client, not recompute here
        //2D array, where inner array is just array of blockIds
        const allConstructs = [];

        //todo - may need to make this more efficent = call stack size exceeded for very large orders.
        order.constructIds.forEach(constructId => {
          const constructPositionalCombinations = positionalCombinations[constructId];
          //guarantee both accumulator (and positions) array have at least one item to map over
          const last = constructPositionalCombinations.pop();

          //iterate through positions, essentially generating tree with * N branches for N options at position
          const combinations = constructPositionalCombinations.reduceRight((acc, position) => {
            // for each extant construct, create one variant which adds each part respectively
            // flatten them for return and repeat!
            return flatten(position.map(option => acc.map(partialConstruct => [option].concat(partialConstruct))));
          }, [last]);

          allConstructs.push(...combinations);
        });

        //prune the list based on the parameters
        const constructList = (!order.parameters.onePot && order.parameters.permutations < order.numberCombinations) ?
          allConstructs.filter((el, idx, arr) => order.parameters.activeIndices[idx] === true) :
          allConstructs;

        //future - this should be dynamic, based on the foundry, pulling from a registry
        return submit(order, user, constructList, blockMap)
          .then(response => {
            // freeze all the blocks in the construct, given blockMap

            const frozenBlocks = Object.keys(blockMap)
              .map(key => blockMap[key])
              .map(block => merge(block, { rules: { frozen: true } }));

            //todo - should not write individually, especially when all blocks in same file
            return Promise.all(frozenBlocks.map(block => persistence.blockWrite(block.id, block, projectId)))
              .then(() => response);
          });
      })
      .then(response => {
        //snapshot, return the order to the client
        return persistence.projectSnapshot(projectId, user.uuid, `ORDER`)
          .then(({ sha, time }) => {
            merge(order, {
              metadata: {
                constructNames,
              },
              projectVersion: sha,
              status: {
                foundry,
                response,
                remoteId: response.jobId,
                price: response.cost,
                timeSent: time,
              },
            });

            return rollup.getProjectRollup(projectId)
              .then(roll => {
                return persistence.orderWrite(order.id, order, projectId, roll);
              });
          });
      })
      .then(order => {
        res.status(200).send(order);
      })
      .catch(err => {
        console.log('Order failed', err, err.stack);

        //todo - handle errors more intelligently
        res.status(400).send(errorInvalidModel);
      });
  });

export default router;
