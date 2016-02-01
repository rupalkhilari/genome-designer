import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import fs from 'fs';
import mkpath from 'mkpath';
import 'isomorphic-fetch';

import { createDescendant, record, getAncestors, getDescendantsRecursively } from './../utils/history';
import { get as dbGet, getSafe as dbGetSafe, set as dbSet } from './../utils/database';
import { errorInvalidModel, errorInvalidRoute } from './../utils/errors';
import { validateBlock, validateProject } from './../utils/validation';
import { getComponents } from './../utils/getRecursively';

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

/*********************************
 * File IO
 * Read and write files
 *********************************/

//All files are put in the storage folder (until platform comes along)
const createFileUrl = (url) => './storage/' + url;

router.get('/file/*', (req, res) => {
  const url = req.params[0];
  const filePath = createFileUrl(url);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(data);
    }
  });
});

router.post('/file/*', (req, res) => {
  const url = req.params[0];
  const filePath = createFileUrl(url);
  const folderPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);

  //assuming contents to be string
  let buffer = '';

  //get data in parts
  req.on('data', data => {
    buffer += data;
  });

  //received all the data
  req.on('end', () => {
    //make folder if doesn't exists
    //todo - should ensure there isn't a file preventing directory creation
    mkpath(folderPath, (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        //write data to file
        fs.writeFile(filePath, buffer, 'utf8', (err) => {
          if (err) {
            res.status(500).send(err.message);
          } else {
            res.send(req.originalUrl);
          }
        });
      }
    });
  });
});

router.delete('/file/*', (req, res) => {
  const url = req.params[0];
  const filePath = createFileUrl(url);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send();
    }
  });
});

// =======================================================================
// authentication proxies
// =======================================================================
router.post('/auth/register', jsonParser, (req, res) => {
  const {email, password} = req.body;
  fetch('http://localhost:8080/auth/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
  })
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    res.send(json);
  });
});


//default catch
router.use('*', (req, res) => {
  res.status(404).send(errorInvalidRoute);
});

export default router;
