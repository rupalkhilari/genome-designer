import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid'; //todo - unify with client side
import { createDescendant, record, getAncestors, getTree } from '../history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from '../database';
import { errorDoesNotExist, errorNoIdProvided } from '../errors';
import { validateBlock, validateProject, assertValidId } from '../validation';
import { getComponents } from '../getRecursively';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

function paramIsTruthy(param) {
  return param !== undefined && param !== 'false';
}

/*********************************
 GET
 Fetch an entry and all sub-entries
 *********************************/

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

router.get('/descendents/:id', (req, res) => {
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
  const data = req.body;
  const id = uuid.v4();

  //todo - should be able to generate scaffold and extend with body, and validate() (allow bypassing)
  const validated = Object.assign(data, {
    id,
  });

  dbSet(id, validated)
    .then(result => res.json(result))
    .catch(err => res.err(err.message));
});

router.post('/block', jsonParser, (req, res) => {
  const data = req.body;
  const id = uuid.v4();

  //todo - should be able to generate scaffold and extend with body, and validate() (allow bypassing)
  const validated = Object.assign(data, {
    id,
  });

  dbSet(id, validated)
    .then(result => res.json(result))
    .catch(err => res.err(err.message));
});

/*********************************
 PUT
 Modify an existing entry
 *********************************/

router.put('/project/:id', jsonParser, (req, res) => {
  const { id } = req.params;
  const data = req.body;

  //todo - verify project, allow bypassing?
  dbSet(id, data)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

router.put('/block/:id', jsonParser, (req, res) => {
  const { id } = req.params;
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
  res.status(404).send('Invalid Route');
});

module.exports = router;
