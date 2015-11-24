import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid'; //todo - unify with client side
import { createDescendant, record, getAncestors, getDescendants, getTree } from '../history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from '../database';
import { errorDoesNotExist, errorNoIdProvided } from '../errors';
import { validateBlock, validateProject, assertValidId } from '../validation';
import { getComponents } from '../getRecursively';

import BlockDefinition from '../../src/schemas/Block';
import ProjectDefinition from '../../src/schemas/Project';

var Random = require("random-js");
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});


function paramIsTruthy(param) {
  return param !== undefined && param !== 'false';
}

router.get('/login', (req, res) => {
  const { id, pw } = req.params;
  //TODO once we have authentication: check if id/pw is correct
  const isValidLogin = true;

  if (isValidLogin) {
    var engine = Random.engines.nativeMath;
    var distribution = Random.hex(false);
    var sha1 = distribution(40);
    
    dbSet(sha1, {"userID": "NA"}).then(result => {
      res.json({"key": sha1});
    });
  }
}

/*********************************
 GET
 Fetch an entry and all sub-entries
 *********************************/

router.get('/project/:id', (req, res) => {
  const { id } = req.params;
  const { tree } = req.query;
  const { key } = req.headers;

  if (!keyIsValid(key)) {      
    res.status(500).send("authentication failed");
    return;
  }

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
  console.log(req.headers);

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
  getDescendants(id)
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

    //check that the project already exists,
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
  
  if (BlockDefinition.validate(data)) {

    //check that the block already exists,
    dbGet(id).then( 
      result =>  {
        dbSet(id, data)
          .then(result => res.json(result))
          .catch(err => res.status(500).send(err.message));
      });
  }

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