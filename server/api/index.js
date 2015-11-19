import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid'; //todo - unify with client side
import { createDescendent, record, getAncestors, getTree } from '../history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from '../database';
import { errorDoesNotExist, errorNoIdProvided } from '../errors';
import { validateBlock, validateProject, assertValidId } from '../validation';
import { getComponents } from '../getRecursively';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

//given a promise, and handlers onSuccess and onError,
// when the promise resolves, will call onSuccess with the value,
// when the promise rejects, will call onError with err.message
function simplePromiseExpressHandler(promise, onSuccess, onError) {
  promise
    .catch(err => {
      onError(err.message);
    })
    .then(onSuccess);
}

/*********************************
 GET
 Fetch an entry and all sub-entries
 *********************************/

router.get('/project/:id', (req, res) => {
  const { id } = req.params;
  const instance = dbGetSafe(id);
  const components = getComponents(id);
  Promise.all([
      instance,
      components,
    ])
    .then(([inst, comps]) => {
      res.json({
        instance: inst,
        components: comps,
      });
    })
    .catch(reason => res.error(reason.message));
});

router.get('/block/:id', (req, res) => {
  const { id } = req.params;
  const instance = dbGetSafe(id);
  const components = getComponents(id);
  Promise.all([
    instance,
    components,
  ])
  .then(([inst, comps]) => {
    res.json({
      instance: inst,
      components: comps,
    });
  })
  .catch(reason => res.error(reason.message));
});

router.get('/history/:id', (req, res) => {
  const { id } = req.params;
  simplePromiseExpressHandler(getAncestors(id), res.json, res.err);
});

router.get('/children/:id', (req, res) => {
  const { id } = req.params;
  simplePromiseExpressHandler(getTree(id), res.json, res.err);
});

/*********************************
 PUT
 Create an entry for the first time, server generates uuid
 *********************************/

router.post('/project/:id', jsonParser, (req, res) => {
  //todo - verify body
  const data = req.body;
  //todo - verify project, allow bypassing?
  const id = uuid.v4();

  //todo - should be able to generate scaffold and extend with body
  const validated = data;

  simplePromiseExpressHandler(dbSet(id, validated), res.json, res.err);
});

router.post('/block/:id', jsonParser, (req, res) => {
  //todo - verify body
  const data = req.body;
  //todo - verify project, allow bypassing?
  const id = uuid.v4();

  //todo - should be able to generate scaffold and extend with body
  const validated = data;

  simplePromiseExpressHandler(dbSet(id, validated), res.json, res.err);
});

/*********************************
 POST
 Modify an existing entry
 *********************************/

router.post('/project/:id', jsonParser, (req, res) => {
  const { id } = req.params;
  //todo - verify body
  const data = req.body;
  //todo - verify project, allow bypassing?
  simplePromiseExpressHandler(dbSet(id, data), res.json, res.err);
});

router.post('/block/:id', jsonParser, (req, res) => {
  const { id } = req.params;
  //todo - verify body
  const data = req.body;
  //todo - verify block, allow bypassing?
  simplePromiseExpressHandler(dbSet(id, data), res.json, res.err);
});

/**
 * Create a child
 */
router.post('/clone', (req, res) => {
  const { id } = req.query;

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
      res.error(err.message);
    })
    .then(clone => {
      res.json(clone);
    });
});

module.exports = router;
