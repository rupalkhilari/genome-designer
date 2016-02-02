import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import fs from 'fs';
import mkpath from 'mkpath';
import merge from 'lodash.merge';
import invariant from 'invariant';

import { errorNoIdProvided, errorInvalidModel, errorInvalidRoute } from './../utils/errors';
import { validateBlock, validateProject } from './../utils/validation';
import { authenticationMiddleware } from './../utils/authentication';
import * as persistence from './persistence';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

/***************************
 Middleware
 ****************************/

//Login and session validator
router.use(authenticationMiddleware);

//JSON parser
router.use(jsonParser);

/***************************
 REST
 ***************************/

/******** Cloning *********/

//todo in future - supporting on client only
router.get('/clone', (req, res) => {
  res.status(501).send('not implemented');
});

/******** PARAMS ***********/

//assign null if they do not exist

router.param('projectId', (req, res, next, id) => {
  const projectId = id;
  persistence.projectGet(projectId)
    .then(project => {
      Object.assign(req, {
        project,
        projectId,
      });
      next();
    })
    .catch(err => {
      res.status(500).send(err);
    });

});

router.param('blockId', (req, res, next, id) => {
  const blockId = id;
  const { projectId } = req.params;
  persistence.blockGet(projectId, blockId)
    .then(block => {
      Object.assign(req, {
        block,
        blockId,
      });
      next();
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/********** ROUTES ***********/

// PUT - replace
// POST - merge

//todo - expecting sequence in POST json
router.route('/:projectId/:blockId/sequence')
  .all((req, res, next) => {
    const { projectId, blockId } = req;

    if (!projectId || !blockId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { projectId, blockId, block } = req;

    persistence.sequenceGet(blockId, projectId)
      .then(sequence => res.status(200).send(sequence))
      .catch(err => res.status(500).send(err));
  })
  .post((req, res) => {
    const { projectId, blockId, block } = req;
    const sequence = req.body;

    persistence.sequenceWrite(blockId, sequence, projectId)
      .then(() => {
        //todo - md5 sequence and return
        //todo - update block sequence length just in case
        res.status(200).send();
      })
      .catch(err => res.status(500).send(err));
  })
  .delete((req, res) => {
    const { projectId, blockId, block } = req;

    persistence.sequenceDelete(blockId, projectId)
      .then(() => res.status(200).send())
      .catch(err => res.status(500).err(err));
  });

router.route('/:projectId/:blockId')
  .all((req, res, next) => {
    const { projectId, blockId } = req;

    if (!projectId || !blockId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { projectId, blockId } = req;

    persistence.blockGet(blockId, projectId)
      .then(result => res.json(result))
      .catch(err => res.status(500).err(err));
  })
  .put((req, res) => {
    const { projectId, blockId, block } = req;

    //todo - force ID and return block

    if (validateBlock(block)) {
      persistence.blockWrite(blockId, block, projectId)
        .then(() => res.status(200).send(block))
        .catch(err => res.status(500).err(err));
    } else {
      res.status(400).send(errorInvalidModel);
    }
  })
  .post((req, res) => {
    const { projectId, blockId, block } = req;

    persistence.blockGet(blockId, projectId)
      .then(retrieved => {
        const merged = merge({}, retrieved, block);

        if (validateBlock(merged)) {
          persistence.blockWrite(blockId, merged)
            .then(result => res.json(merged))
            .catch(err => res.status(500).err(err));
        } else {
          res.status(400).send(errorInvalidModel);
        }
      });
  })
  .delete((req, res) => {
    const { blockId, projectId } = req;
    persistence.blockDelete(blockId, projectId)
      .then(() => res.status(200).send(blockId))
      .catch(err => res.status(500).send(err));
  });

router.route('/:projectId')
  .all((req, res, next) => {
    const { projectId } = req;

    if (!projectId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { projectId } = req;
    const { depth } = req.query; //future

    persistence.projectGet(projectId)
      .then(result => res.json(result))
      .catch(err => res.status(500).err(err));
  })
  .put((req, res) => {
    const { projectId, project } = req;
    //todo - force ID and return project

    if (validateProject(project)) {
      persistence.projectWrite(projectId, project)
        .then(result => res.json(result))
        .catch(err => res.status(500).err(err));
    } else {
      res.status(400).send(errorInvalidModel);
    }
  })
  .post((req, res) => {
    const { projectId, project } = req;

    persistence.projectGet(projectId, projectId)
      .then(retrieved => {
        const merged = merge({}, retrieved, project);

        if (validateProject(merged)) {
          persistence.projectWrite(projectId, merged)
            .then(result => res.json(merged))
            .catch(err => res.status(500).err(err));
        } else {
          res.status(400).send(errorInvalidModel);
        }
      });
  })
  .delete((req, res) => {
    const { projectId } = req;
    persistence.projectDelete(projectId)
      .then(() => res.status(200).send(projectId))
      .catch(err => res.status(500).send(err));
  });

//default catch
router.use('*', (req, res) => {
  res.status(404).send(errorInvalidRoute);
});

export default router;
