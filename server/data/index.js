import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import fs from 'fs';
import mkpath from 'mkpath';
import merge from 'lodash.merge';
import invariant from 'invariant';

import { createDescendant, record, getAncestors, getDescendantsRecursively } from './../utils/history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from './../utils/database';
import { errorNoIdProvided, errorInvalidModel, errorInvalidRoute } from './../utils/errors';
import { validateBlock, validateProject } from './../utils/validation';
import { authenticationMiddleware } from './../utils/authentication';
import { getComponents } from './../utils/getRecursively';

import * as persistence from './../utils/persistence';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

function paramIsTruthy(param) {
  return (param !== undefined && param !== 'false') || param === true;
}

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

//todo - right now, supporting on client only
router.get('/clone', (req, res) => {
  res.status(501).send('not implemented');
});

/******** PARAMS ***********/

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

router.route('/:projectId/:blockId/sequence')
  .all((req, res, next) => {
    const { projectId, blockId } = req;
    if (!projectId || ! blockId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { projectId, blockId, block } = req;

  })
  .post((req, res) => {
    const { projectId, blockId, block } = req;

    //update block sequence length just in case

  })
  .delete((req, res) => {});

router.route('/:projectId/:blockId')
  .all((req, res, next) => {
    const { projectId, blockId } = req;
    if (!projectId || ! blockId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { projectId, blockId, block } = req;
  })
  .put((req, res) => {
    const { projectId, blockId, block } = req;
    //todo - validate
  })
  .post((req, res) => {
    const { projectId, blockId, block } = req;
    //todo - validate
  })
  .delete((req, res) => {});

router.route('/:projectId')
  .all((req, res, next) => {
    const { projectId } = req;
    if (!projectId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { depth } = req.query; //future
  })
  .put((req, res) => {
    //todo - validate
  })
  .post((req, res) => {
    //todo - validate
  })
  .delete((req, res) => {});


///////////////// DEPRECATED //////////////////////

router.get('/project/:id', (req, res) => {
  const { id } = req.params;
  const { tree } = req.query;

  if (paramIsTruthy(tree)) {
    Promise
      .all([
        dbGetSafe(id),
        getComponents(id),
      ])
      .then(([inst, comps]) => {
        res.json({
          instance: inst,
          components: comps,
        });
      })
      .catch(err => res.status(500).send(err.message));
  } else {
    dbGetSafe(id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  }
});

router.get('/block/:id', (req, res) => {
  const { id } = req.params;
  const { tree } = req.query;

  if (paramIsTruthy(tree)) {
    Promise
      .all([
        dbGetSafe(id),
        getComponents(id),
      ])
      .then(([inst, comps]) => {
        res.json({
          instance: inst,
          components: comps,
        });
      })
      .catch(err => res.status(500).send(err.message));
  } else {
    dbGetSafe(id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  }
});

router.get('/ancestors/:id', (req, res) => {
  const { id } = req.params;

  getAncestors(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

router.get('/descendants/:id', (req, res) => {
  const { id } = req.params;
  const { depth } = req.query;

  getDescendantsRecursively(id, depth)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

/*********************************
 POST
 Create an entry for the first time.
 Forces a new ID, to guarantee object is new.

 future - extend scaffold with posted body, then check if valid
 future - allow bypassing of validation?
 *********************************/

router.post('/project', jsonParser, (req, res) => {
  const data = req.body;
  const id = uuid.v4();
  Object.assign(data, {
    id,
  });

  if (validateProject(data)) {
    dbSet(id, data)
      .then(result => res.json(result))
      .catch(err => res.status(500).err(err.message));
  } else {
    res.status(400).send(errorInvalidModel);
  }
});

router.post('/block', jsonParser, (req, res) => {
  const data = req.body;
  const id = uuid.v4();
  Object.assign(data, {
    id,
  });

  if (validateBlock(data)) {
    dbSet(id, data)
      .then(result => res.json(result))
      .catch(err => res.status(500).err(err.message));
  } else {
    res.status(400).send(errorInvalidModel);
  }
});

/*********************************
 PUT
 Modify an existing entry.
 Creates the object if it does not exist. ID of URL is assigned to object.
 *********************************/

router.put('/project/:id', jsonParser, (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Object.assign(data, {
    id,
  });

  //Check that the input is a valid Project
  if (validateProject(data)) {
    dbSet(id, data)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  } else {
    res.status(400).send(errorInvalidModel);
  }
});

router.put('/block/:id', jsonParser, (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Object.assign(data, {
    id,
  });

  if (validateBlock(data)) {
    dbSet(id, data)
      .then(result => {
        console.log('result', result);
        return res.json(result);
      })
      .catch(err => res.status(500).send(err.message));
  } else {
    res.status(400).send(errorInvalidModel);
  }
});

/**
 * Create a child instance
 */
router.post('/clone/:id', (req, res) => {
  const { id } = req.params;

  dbGet(id)
    .then(instance => {
      const clone = createDescendant(instance);
      return dbSet(clone.id, clone)
        .then(() => {
          return record(clone.id, instance.id);
        })
        .then(() => clone);
    })
    .catch(err => {
      res.status(500).send(err.message);
    })
    .then(clone => {
      res.json(clone);
    });
});

//default catch
router.use('*', (req, res) => {
  res.status(404).send(errorInvalidRoute);
});

export default router;
