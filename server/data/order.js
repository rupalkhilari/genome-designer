import express from 'express';
import {
  errorNoIdProvided,
  errorInvalidModel,
  errorInvalidRoute,
  errorDoesNotExist,
  errorCouldntFindProjectId,
  errorVersioningSystem,
} from './../utils/errors';
import * as querying from './querying';
import * as persistence from './persistence';
import * as rollup from './rollup';
import { permissionsMiddleware } from './permissions';

import Order from '../../src/models/Order';

const router = express.Router(); //eslint-disable-line new-cap

router.param('projectId', (req, res, next, id) => {
  Object.assign(req, { projectId: id });
  next();
});

router.route('/:projectId/:orderId?')
  .all(permissionsMiddleware)
  .get((req, res, next) => {
    const { user, projectId } = req;
    const { orderId } = req.params;

    //todo - if no order ID, get list of orders
    if (!orderId) {
      res.status(501).send([]);
      return;
    }

    //todo - get the order and return it
    res.status(501).send({});
  })
  .post((req, res, next) => {
    const { user, projectId } = req;
    const { foundry, order } = req.body;

    console.log(projectId);
    console.log(user);
    console.log(foundry);
    console.log(order);

    if (!Order.validateSetup(order)) {
      next(errorInvalidModel);
    }

    // todo
    // attempt to send the order...
    // convert constructs to part lists
    // if successful...
    // set foundry and remote ID
    // set user ID based on request
    // snapshot project
    // set project version
    // validate order
    // add to project folder
    // return the order
    res.status(200).send(order);
  });

export default router;
