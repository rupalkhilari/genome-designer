import express from 'express';
import bodyParser from 'body-parser';
import { authenticationMiddleware } from '../utils/authentication';
import listExtensions from './registry';
import loadExtension from './loadExtension';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json();

router.use(authenticationMiddleware);
router.use(jsonParser);

router.get('/list', (req, res) => {
  res.json(listExtensions);
});

router.get('/manifest/:extension', (req, res) => {
  const { extension } = req.params;

  loadExtension(extension)
  .then(manifest => {
    res.json(manifest);
  })
  .catch(err => {
    console.error(err);
    res.status(500).err(err);
  });
});

router.get('load/:extension', (req, res) => {
  const { extension } = req.params;
});

export default router;
