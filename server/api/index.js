import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import { createDescendant, record, getAncestors, getDescendantsRecursively } from '../history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from '../database';
import { errorDoesNotExist, errorNoIdProvided, errorInvalidSessionKey, errorInvalidModel, errorInvalidRoute } from '../errors';
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
  validateLoginCredentials(user, password).then(key => {
    res.json({'session-key': key});
  }).catch(err => {
    console.log(err);
    res.status(403).send(errorInvalidSessionKey);
  });
});

/*********************************
 GET
 Fetch an entry and all sub-entries
 *********************************/

router.get('/project/:id', (req, res) => {
  const { id } = req.params;
  const { tree } = req.query;
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {
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
  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

router.get('/block/:id', (req, res) => {
  const { id } = req.params;
  const { tree } = req.query;
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {

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

  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

router.get('/ancestors/:id', (req, res) => {
  const { id } = req.params;
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {
    getAncestors(id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

router.get('/descendants/:id', (req, res) => {
  const { id } = req.params;
  const { depth } = req.query;
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {
    getDescendantsRecursively(id, depth)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));

  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

/*********************************
 POST
 Create an entry for the first time.
 Forces a new ID, to guarantee object is new.

 future - extend scaffold with posted body, then check if valid
 future - allow bypassing of validation?
 *********************************/

router.post('/project', jsonParser, (req, res) => {
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {
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

  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

router.post('/block', jsonParser, (req, res) => {
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {
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

  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

/*********************************
 PUT
 Modify an existing entry.
 Creates the object if it does not exist. ID of URL is assigned to object.
 *********************************/

router.put('/project/:id', jsonParser, (req, res) => {
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {
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
  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

router.put('/block/:id', jsonParser, (req, res) => {
  const key = req.headers['session-key'];

  validateSessionKey(key).then(valid => {
    const { id } = req.params;
    const data = req.body;
    Object.assign(data, {
      id,
    });

    if (validateBlock(data)) {
      dbSet(id, data)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(err.message));
    } else {
      res.status(400).send(errorInvalidModel);
    }
  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

/**
 * Create a child instance
 */
router.post('/clone/:id', (req, res) => {
  const key = req.headers['session-key'];
  const { id } = req.params;

  validateSessionKey(key).then(valid => {

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

  }).catch(err => res.status(403).send(errorInvalidSessionKey));
});

//default catch
router.use('*', (req, res) => {
  res.status(404).send(errorInvalidRoute);
});

export default router;
