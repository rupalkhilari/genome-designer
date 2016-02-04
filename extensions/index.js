import express from 'express';
import bodyParser from 'body-parser';
import { sessionMiddleware } from '../server/utils/authentication';
import { getExtensionsInfo } from './requireExtensions';
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});

router.use(sessionMiddleware);

router.get('', jsonParser, (req, resp) => {
  getExtensionsInfo()
  .then(res => {
    resp.json(res);
  });
});

module.exports = router;
