import express from 'express';
import bodyParser from 'body-parser';
import { errorNoIdProvided, errorInvalidModel, errorInvalidRoute, errorDoesNotExist } from './../utils/errors';
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

  /*
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
   */
});

router.param('blockId', (req, res, next, id) => {
  const blockId = id;
  Object.assign(req, {blockId});
  next();

  /*
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
   */
});

/********** ROUTES ***********/

// is this a hack? or super useful?!
// allow the route /block/<blockId> and find the projectId
router.all((req, res, next) => {
  const { projectId, blockId } = req;

  if (projectId === 'block' && blockId) {
    persistence.findProjectFromBlock(blockId)
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
});

// PUT - replace
// POST - merge

//todo - expecting sequence in POST json, update middleware
router.route('/:projectId/:blockId/sequence')
  .all(textParser, (req, res, next) => {
    const { projectId, blockId } = req;

    if (!projectId || !blockId) {
      res.status(400).send(errorNoIdProvided);
    }
    next();
  })
  .get((req, res) => {
    const { projectId, blockId } = req;

    persistence.sequenceGet(blockId, projectId)
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
          //this means the block does not exist
          res.status(400).send(errorDoesNotExist);
        }
        res.status(500).err(err);
      });
  })
  .post((req, res) => {
    const { projectId, blockId } = req;
    const sequence = req.body;

    persistence.sequenceWrite(blockId, sequence, projectId)
      .then(() => {
        //todo - md5 sequence and return
        //todo - update block sequence length just in case
        res.status(200).send();
      })
      .catch(err => res.status(500).send(err));
  })
  .delete((req, res) => {
    const { projectId, blockId } = req;

    persistence.sequenceDelete(blockId, projectId)
      .then(() => res.status(200).send())
      .catch(err => {
        if (err === errorDoesNotExist) {
          res.status(400).send(errorInvalidModel);
        }
        res.status(500).err(err);
      });
  });

router.route('/:projectId/commit/:sha?')
  .get((req, res) => {
    //pass the SHA you want, otherwise loads the head
    const { projectId } = req;
    const { sha } = req.params;

    persistence.projectGet(projectId, sha)
      .then(project => res.status(200).json(project))
      .catch(err => res.status(500).err(err));
  })
  .post((req, res) => {
    //you can POST a field `message` for the commit, receieve the SHA
    const { projectId } = req;
    const { message } = req.body;

    persistence.projectSave(projectId, message)
      .then(sha => res.status(200).send(sha))
      .catch(err => res.status(500).err(err));
  });

router.route('/:projectId/:blockId')
  .all((req, res, next) => {
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
      .catch(err => res.status(500).err(err));
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
        res.status(500).err(err);
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
      .catch(err => res.status(500).err(err));
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
      .catch(err => res.status(500).err(err));
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
        res.status(500).err(err);
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
