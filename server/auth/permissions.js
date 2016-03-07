import invariant from 'invariant';

//testing

export const checkProjectAccess = (projectId, userId) => {
  return Promise.resolve(true);
};

export const permissionsMiddleware = (req, res, next) => {
  const { projectId, user } = req;

  invariant(user.userid, 'no user id present on user object');
  invariant(projectId, 'projectID not found on route request');

  checkProjectAccess(projectId, user.userid)
  .then(() => next())
  .catch((err) => {
    console.log('error!', err);
    res.status(403).send(`User ${user.email} does not have access to project ${projectId}`);
  });
};
