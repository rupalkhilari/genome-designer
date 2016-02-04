import express from 'express';
import { errorInvalidSessionKey } from './errors';

const router = express.Router(); //eslint-disable-line new-cap

export const validateUser = (user, password) => {
  const fakeKey = `${user}-key`;
  return Promise.resolve(fakeKey);
};

export const validateSessionKey = (key) => {
  return Promise.resolve(true);
};

export const authenticationMiddleware = (req, res, next) => {
  const { sessionkey } = req.headers;
  //console.log('session key: ' + sessionkey);

  //todo - fetch user information
  const user = {};

  return validateSessionKey(sessionkey)
    .then(() => {
      Object.assign(req, {user});
      next();
    })
    .catch(() => {
      res.status(403).send(errorInvalidSessionKey);
    });
};

router.use('/login', (req, res) => {
  const { user, password } = req.query;
  validateUser(user, password)
    .then(key => {
      res.json({'sessionkey': key});
    })
    .catch(err => {
      res.status(403).send(errorInvalidSessionKey);
    });
});

export const authRouter = router;
