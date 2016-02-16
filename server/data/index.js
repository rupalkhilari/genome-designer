import express from 'express';
import bodyParser from 'body-parser';
import { errorNoIdProvided, errorInvalidModel, errorInvalidRoute, errorDoesNotExist } from './../utils/errors';
import findProjectFromBlock from './findProjectFromBlock';
import { authenticationMiddleware } from './../utils/authentication';
import * as persistence from './persistence';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});
const textParser = bodyParser.text();

/***************************
 Middleware
 ****************************/

//Login and session validator
router.use(authenticationMiddleware);

router.use(jsonParser);

// allow the route /block/<blockId> and find the projectId
// not recommended e.g. for POST
// dependent on param middleware below to assign IDs to req directly
const blockDeterminatorMiddleware = (req, res, next) => {
  const { projectId, blockId } = req;

  if (projectId === 'block' && blockId) {
    findProjectFromBlock(blockId)
      .then(projectId => {
        Object.assign(req, {projectId});
        next();
      })
      .catch(err => {
        res.status(404).send('Could not find project ID automatically for block ID ' + blockId);
      });
  } else if (projectId === 'block' && !blockId) {
    // tried to access route /block without a block ID
    res.status(404).send('Block ID required');
  } else {
    next();
  }
};

/***************************
 REST
 ***************************/

/******** Cloning *********/

//todo in future - supporting on client only
router.get('/clone', jsonParser, (req, res) => {
  res.status(501).send('not implemented');
});

/******** PARAMS ***********/

//assign null if they do not exist

router.param('projectId', (req, res, next, id) => {
  const projectId = id;
  Object.assign(req, {projectId});
  next();
});

router.param('blockId', (req, res, next, id) => {
  const blockId = id;
  Object.assign(req, {blockId});
  next();
});

/********** ROUTES ***********/

/*
 In general:

 PUT - replace
 POST - merge
 */

//expect that a well-formed md5 is sent. however, not yet checking. So you really could just call it whatever you wanted...

// future - url + `?format=${format}`;
router.route('/sequence/:md5/:blockId?')
  .get((req, res) => {
    const { md5 } = req.params;

    persistence.sequenceGet(md5)
      .then(sequence => {
        if (!sequence) {
          res.status(204).send('');
        }
        res.status(200)
          .set('Content-Type', 'text/plain')
          .send(sequence);
      })
      .catch(err => {
        if (err === errorDoesNotExist) {
          res.status(400).send(errorDoesNotExist);
        }
        res.status(500).send(err);
      });
  })
  .post(textParser, (req, res) => {
    const { md5, blockId } = req.params;
    const sequence = req.body;

    findProjectFromBlock(blockId)
      .catch(() => {
        //couldn't find projectId or no block ID provided, just write the sequence
        return persistence.sequenceWrite(md5, sequence);
      })
      .then(projectId => {
        return persistence.sequenceWrite(md5, sequence, blockId, projectId);
      })
      .then(() => {
        res.status(200).send();
      })
      .catch(err => res.status(500).send(err));
  })
  .delete((req, res) => {
    res.status(403).send('Not allowed to delete sequence');
  });

//pass SHA you want, otherwise get commit log
router.get('/:projectId/:blockId/commit/:sha?', (req, res) => {
  const { blockId, projectId } = req;
  const { sha } = req.params;

  if (!!sha) {
    persistence.blockGet(blockId, projectId, sha)
      .then(project => res.status(200).json(project))
      .catch(err => res.status(500).send(err));
  } else {
    //todo
    res.status(501).send('not supported yet');
  }
});

router.route('/:projectId/commit/:sha?')
  .get((req, res) => {
    //pass the SHA you want, otherwise send commit log
    const { projectId } = req;
    const { sha } = req.params;

    if (sha) {
      persistence.projectGet(projectId, sha)
        .then(project => res.status(200).json(project))
        .catch(err => res.status(500).send(err));
    } else {
      //todo
      res.status(501).send('not supported yet');
    }
  })
  .post((req, res) => {
    //you can POST a field `message` for the commit, receieve the SHA
    const { projectId } = req;
    const { message } = req.body;

    persistence.projectSave(projectId, message)
      .then(sha => res.status(200).send(sha))
      .catch(err => res.status(500).send(err));
  });

router.route('/:projectId/:blockId')
  .all(blockDeterminatorMiddleware, (req, res, next) => {
    const { projectId, blockId } = req;

    if (!projectId || !blockId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { projectId, blockId } = req;

    persistence.blockGet(blockId, projectId)
      .then(result => {
        if (!result) {
          res.status(204).json(null);
        }
        res.json(result);
      })
      .catch(err => res.status(500).send(err));
  })
  .put((req, res) => {
    const { projectId, blockId } = req;
    const block = req.body;

    persistence.blockWrite(blockId, block, projectId)
      .then(result => res.json(result))
      .catch(err => {
        if (err === errorInvalidModel) {
          res.status(400).send(errorInvalidModel);
        }
        res.status(500).send(err);
      });
  })
  .post((req, res) => {
    const { projectId, blockId } = req;
    const block = req.body;

    if (!!block.id && block.id !== blockId) {
      res.status(400).send(errorInvalidModel);
    }

    persistence.blockMerge(blockId, block, projectId)
      .then(merged => res.json(merged))
      .catch(err => {
        if (err === errorInvalidModel) {
          res.status(400).send(errorInvalidModel);
        }
        res.status(500).send(err);
      });
  })
  .delete((req, res) => {
    const { blockId, projectId } = req;

    persistence.blockDelete(blockId, projectId)
      .then(() => res.status(200).send(blockId))
      .catch(err => res.status(500).send(err));
  });

router.route('/:projectId')
  .get((req, res) => {
    const { projectId } = req;
    //const { depth } = req.query; //future

    persistence.projectGet(projectId)
      .then(result => {
        if (!result) {
          res.status(204).json(null);
        }
        res.json(result);
      })
      .catch(err => res.status(500).send(err));
  })
  .put((req, res) => {
    const { projectId } = req;
    const project = req.body;

    persistence.projectWrite(projectId, project)
      .then(result => res.json(result))
      .catch(err => {
        if (err === errorInvalidModel) {
          res.status(400).send(errorInvalidModel);
        }
        res.status(500).send(err);
      });
  })
  .post((req, res) => {
    const { projectId } = req;
    const project = req.body;

    if (!!project.id && project.id !== projectId) {
      res.status(400).send(errorInvalidModel);
    }

    persistence.projectMerge(projectId, project)
      .then(merged => res.status(200).send(merged))
      .catch(err => {
        if (err === errorInvalidModel) {
          res.status(400).send(errorInvalidModel);
        }
        res.status(500).send(err);
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
