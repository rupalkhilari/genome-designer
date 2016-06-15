import express from 'express';
import checkUserSetup from './userSetup';

export const router = express.Router(); //eslint-disable-line new-cap

export const defaultUser = {
  uuid: '0',
  email: 'developer@localhost',
  firstName: 'Dev',
  lastName: 'Eloper',
};

router.post('/login', (req, res) => {
  res.cookie('sess', 'mock-auth');
  res.statusCode = 200;
  res.send(defaultUser);
  return res.end();
});

router.get('/current-user', (req, res) => {
  if (req.cookies.sess === null) {
    console.log('didnt find the session cookie; check the mock login route.');
    return res.status(401).end();
  }

  if (req.user === null) {
    console.log('auth middleware error; req.user is null');
    res.statusCode = 500;
    return res.end();
  }

  res.statusCode = 200;
  res.send(req.user);
  return res.end();
});

//testing only - route not present in auth module
router.get('/cookies', (req, res) => {
  if (req.cookies.sess) {
    return res.send(req.cookies.sess);
  }

  res.send(':(');
});

export const mockUser = (req, res, next) => {
  if (req.cookies.sess !== null) {
    Object.assign(req, { user: defaultUser });
  }

  //stub the initial user setup here as well
  checkUserSetup({uuid: 0})
    .then(() => next());
};
