import express from 'express';
import bodyParser from 'body-parser';
import { authenticationMiddleware } from '../utils/authentication';
import { getExtensionsInfo } from '../../extensions/requireExtensions';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json();

router.use(authenticationMiddleware);
router.use(jsonParser);

router.get('*', (req, resp) => {
  getExtensionsInfo()
    .then(res => {
      resp.json(res);
    });
});

export default router;
