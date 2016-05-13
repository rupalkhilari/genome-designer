import express from 'express';
import bodyParser from 'body-parser';
import {
  errorNoUser,
} from './../utils/errors';
import errorHandlingMiddleware from '../utils/errorHandlingMiddleware';
import orders from '../moogoose-models/orders';

const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects,
  limit: '50mb',
});

/***************************
 Middleware
 ****************************/

router.use(jsonParser);
router.use(errorHandlingMiddleware);
// ==================================================================
// orders
// ==================================================================
router.route('/createorder')
  .post((req, res, next) => {
    orders.create(req.user ? req.user.uuid : null, req.body.projectid)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((fail) => {
        res.status(500).json({error:fail.error});
      });
  });

export default router;
