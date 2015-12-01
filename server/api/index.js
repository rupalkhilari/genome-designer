import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid'; //todo - unify with client side
import { createDescendant, record, getAncestors, getDescendants, getTree } from '../history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from '../database';
import { errorDoesNotExist, errorNoIdProvided } from '../errors';
import { validateBlock, validateProject, assertValidId } from '../validation';
import { validateSessionKey, validateLoginCredentials } from '../authentication';
import { getComponents } from '../getRecursively';

import BlockDefinition from '../../src/schemas/Block';
import ProjectDefinition from '../../src/schemas/Project';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

var http = require('http');

var cam_hostname = '0.0.0.0';
var cam_portnum = 3001;

var extensions_hostname = '0.0.0.0';
var extensions_portnum = 3002;

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
      res.status(500).send(err.message);
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
  }).catch(err => res.status(500).send(err.message));
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

  }).catch(err => res.status(500).send(err.message));
});

router.get('/ancestors/:id', (req, res) => {
  const { id } = req.params;
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {
    getAncestors(id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  }).catch(err => res.status(500).send(err.message));
});

router.get('/descendants/:id', (req, res) => {
  const { id } = req.params;
  const key = req.headers["session-key"];

  validateSessionKey(key).then( valid => {
    getDescendants(id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  
  }).catch(err => res.status(500).send(err.message));
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
        .catch(err => res.err(err.message));
    }

  }).catch(err => res.status(500).send(err.message));
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
        .catch(err => res.err(err.message));
    }

  }).catch(err => res.status(500).send(err.message));
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
    }

  }).catch(err => res.status(500).send(err.message));
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
    }

    dbSet(id, data)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  }).catch(err => res.status(500).send(err.message));
});


/**
 * Create a child
 */
router.post('/clone/:id', jsonParser, (req, res) => {
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

  }).catch(err => res.status(500).send(err.message));
});

/**************
Extensions
**************/

function redirectRequest(type, hostname, portnum) {
  return (req, res) => {
    const params = req.params;
    const data = req.body;

    var options = {
      host: hostname,
      port: portnum,
      path: '/',
      method: type,
      data: data,
      formData: params,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    var httpreq = http.request(options, response => {
      response.setEncoding('utf8');
      response.on('data', chunk => {
        res.send(chunk);
      });
      response.on('end', function() {
        res.send('ok');
      });
    });
  };
}

router.post(/extensions/, jsonParser, redirectRequest( 'POST', extensions_hostname, extensions_portnum ));

router.get(/cam/, jsonParser, redirectRequest( 'GET', cam_hostname, cam_portnum ));

router.put(/cam/, jsonParser, redirectRequest( 'PUT', cam_hostname, cam_portnum ));

router.post(/cam/, jsonParser, redirectRequest( 'POST', cam_hostname, cam_portnum ));

//default catch
router.use('*', (req, res) => {
  res.status(404).send('Invalid Route');
});

module.exports = router;
