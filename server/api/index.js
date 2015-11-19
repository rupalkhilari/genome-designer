import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid'; //todo - unify with client side
import { createDescendent, record, getAncestors, getTree } from '../history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from '../database';
import { errorDoesNotExist, errorNoIdProvided } from '../errors';
import { validateBlock, validateProject, assertValidId } from '../validation';
import { getComponents } from '../getRecursively';

import BlockDefinition from '../../src/schemas/Block';
import ProjectDefinition from '../../src/schemas/Project';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

/*********************************
 GET
 Fetch an entry and all sub-entries
 *********************************/

router.get('/project/:id', (req, res) => {
  const { id } = req.params;
  const instance = dbGetSafe(id);
  const components = getComponents(id);

  Promise
    .all([
      instance,
      components,
    ])
    .then(([inst, comps]) => {
      res.json({
        instance: inst,
        components: comps,
      });
    })
    .catch(reason => res.status(500).send(reason.message));
});

router.get('/block/:id', (req, res) => {
  const { id } = req.params;
  const instance = dbGetSafe(id);
  const components = getComponents(id);

  Promise
    .all([
      instance,
      components,
    ])
    .then(([inst, comps]) => {
      res.json({
        instance: inst,
        components: comps,
      });
    })
    .catch(err => res.status(500).send(err.message));
});

router.get('/history/:id', (req, res) => {
  const { id } = req.params;
  getAncestors(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

router.get('/children/:id', (req, res) => {
  const { id } = req.params;
  getTree(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

/*********************************
 POST
 Create an entry for the first time, server generates uuid
 *********************************/

router.post('/project', jsonParser, (req, res) => {
  //todo - verify body
  const data = req.body;
  //todo - verify project, allow bypassing?
  const id = uuid.v4();
  data.id = id;

  if (ProjectDefinition.validate(data)) {
    //todo - should be able to generate scaffold and extend with body
    const validated = data;

    dbSet(id, validated)
      .then(result => res.json(result))
      .catch(err => res.err(err.message));
  }
});

router.post('/block', jsonParser, (req, res) => {
  //todo - verify body
  const data = req.body;
  //todo - verify project, allow bypassing?
  const id = uuid.v4();
  data.id = id;

  if (BlockDefinition.validate(data)) {
    //todo - should be able to generate scaffold and extend with body
    const validated = data;

    dbSet(id, validated)
      .then(result => res.json(result))
      .catch(err => res.err(err.message));
  }
});

/*********************************
 PUT
 Modify an existing entry
 *********************************/

router.put('/project/:id', jsonParser, (req, res) => {
  const { id } = req.params;
  //todo - verify body
  const data = req.body;
  data.id = id;
  
  //Check that the input is a valid Project
  if (ProjectDefinition.validate(data)) {

    //check that the project already exists, otherwise use PUT
    dbGet(id).then( 
      result =>  {
        dbSet(id, data)
          .then(result => res.json(result))
          .catch(err => res.status(500).send(err.message));
      });
  }
});

router.put('/block/:id', jsonParser, (req, res) => {
  const { id } = req.params;
  //todo - verify body
  const data = req.body;
  //todo - verify block, allow bypassing?

  dbSet(id, data)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

/**
 * Create a child
 */
router.post('/clone/:id', (req, res) => {
  const { id } = req.params;

  dbGet(id)
    .then(instance => {
      const clone = createDescendent(instance);
      return dbSet(clone.id, clone)
        .then(() => {
          return record(clone, instance);
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
  res.status(404).send('Invalid Route');
});

module.exports = router;
