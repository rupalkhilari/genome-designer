import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import { createDescendant, record, getAncestors, getDescendants, getTree } from '../history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from '../database';
import { errorDoesNotExist, errorNoIdProvided, errorInvalidSession, errorInvalidModel, errorInvalidRoute } from '../errors';
import { validateBlock, validateProject, assertValidId } from '../validation';
import { validateSessionKey, validateLoginCredentials } from '../authentication';
import { getComponents } from '../getRecursively';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});


function paramIsTruthy(param) {
  return param !== undefined && param !== 'false';
}

/***************************
Login and session validator
****************************/

router.get('/login', (req, res) => {
  const { user, password } = req.params;
  //TODO once we have authentication: check if id/pw is correct
  validateLoginCredentials(user, password).then( key => {
    res.json({"session-key": key});
  }).catch(err => {
      console.log(err); 
      res.status(403).send(errorInvalidSession);
  });
});


/*********************************
 GET
 Fetch an entry and all sub-entries
 *********************************/

router.get('/project/:id', (req, res) => {
  const { id } = req.params;
  const { tree } = req.query;
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {
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
  }).catch(err => res.status(403).send(errorInvalidSession));
});

router.get('/block/:id', (req, res) => {
  const { id } = req.params;
  const { tree } = req.query;
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {

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

  }).catch(err => res.status(403).send(errorInvalidSession));
});

router.get('/ancestors/:id', (req, res) => {
  const { id } = req.params;
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {
    getAncestors(id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  }).catch(err => res.status(403).send(errorInvalidSession));
});

router.get('/descendants/:id', (req, res) => {
  const { id } = req.params;
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {
    getDescendants(id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  
  }).catch(err => res.status(403).send(errorInvalidSession));
});

/*********************************
 POST
 Create an entry for the first time, server generates uuid
 *********************************/

router.post('/project', jsonParser, (req, res) => {
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {

    //todo - verify body
    const data = req.body;
    //todo - verify project, allow bypassing?
    const id = uuid.v4();
    data.id = id;

    if (validateProject(data)) {
      //todo - should be able to generate scaffold and extend with body
      const validated = data;

      dbSet(id, validated)
        .then(result => res.json(result))
        .catch(err => res.status(500).err(err.message));
    } else {
      res.status(400).send(errorInvalidModel);
    }

  }).catch(err => res.status(403).send(errorInvalidSession));
});

router.post('/block', jsonParser, (req, res) => {
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {
    //todo - verify body
    const data = req.body;
    //todo - verify project, allow bypassing?
    const id = uuid.v4();
    data.id = id;

    if (validateBlock(data)) {
      //todo - should be able to generate scaffold and extend with body
      const validated = data;

      dbSet(id, validated)
        .then(result => res.json(result))
        .catch(err => res.status(500).err(err.message));
    } else {
      res.status(400).send(errorInvalidModel);
    }

  }).catch(err => res.status(403).send(errorInvalidSession));
});

/*********************************
 PUT
 Modify an existing entry
 *********************************/

router.put('/project/:id', jsonParser, (req, res) => {
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {

    const { id } = req.params;
    //todo - verify body
    const data = req.body;
    data.id = id;
    
    //Check that the input is a valid Project
    if (validateProject(data)) {

      //check that the project already exists,
      dbGet(id).then( 
        result =>  {
          dbSet(id, data)
            .then(result => res.json(result))
            .catch(err => res.status(500).send(err.message));
        });
    } else {
      res.status(400).send(errorInvalidModel);
    }

  }).catch(err => res.status(403).send(errorInvalidSession));
});

router.put('/block/:id', jsonParser, (req, res) => {
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {
    const { id } = req.params;
    //todo - verify body
    const data = req.body;
    
    if (validateBlock(data)) {

      //check that the block already exists,
      dbGet(id).then( 
        result =>  {
          dbSet(id, data)
            .then(result => res.json(result))
            .catch(err => res.status(500).send(err.message));
        });
    } else {
      res.status(400).send(errorInvalidModel);
    }

    dbSet(id, data)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  }).catch(err => res.status(403).send(errorInvalidSession));
});


/**
 * Create a child
 */
router.post('/clone/:id', (req, res) => {
  const key = req.headers["session-key"];
  const { id } = req.params;

  validateSessionKey(key).then( valid => {

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

  }).catch(err => res.status(403).send(errorInvalidSession));
});

//default catch
router.use('*', (req, res) => {
  res.status(404).send(errorInvalidRoute);
});

module.exports = router;