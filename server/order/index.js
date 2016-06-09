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
    const { foundry, order } = req.body;

    if (projectId !== order.projectId) {
      res.status(401).send('project ID and order.projectId must match');
    }

    //note - this expects order.id to be defined
    if (!Order.validateSetup(order)) {
      next(errorInvalidModel);
    }

    if (foundry !== 'egf') {
      return res.status(501).send('foundry must be EGF');
    }

    //assign user to the order
    merge(order, {
      user: user.uuid,
    });

    //future - this should be dynamic, based on the foundry, pulling from a registry
    submit(order, user)
      .then(response => {
        // freeze all the blocks in the construct
        Promise.all(order.constructIds.map((constructId) => rollup.getContents(constructId, projectId)))
          .then(nestedContents => flatten(nestedContents))
          .then(blocks => blocks.map(block => {
            block.rules.frozen = true;
            return block;
          }))
          .then(blocks => Promise.all(blocks.map(block => persistence.blockWrite(block.id, block, projectId))))
          //snapshot, return the order to the client
          .then(() => persistence.projectSnapshot(projectId, user.uuid, `ORDER`))
          .then(({ sha, time }) => {
            merge(order, {
              projectVersion: sha,
              status: {
                foundry,
                response,
                remoteId: response.jobId,
                price: response.cost,
                timeSent: time,
              },
            });

            return persistence.orderWrite(order.id, order, projectId);
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
