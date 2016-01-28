//import { errorInvalidSessionKey, errorSessionKeyNotValidated } from './errors';

//temp
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
