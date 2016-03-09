import * as filePaths from '../utils/filePaths';
import * as fileSystem from '../utils/fileSystem';
import { errorDoesNotExist } from '../utils/errors';

//testing

export const createProjectPermissions = (projectId, userId) => {
  const projectPermissionsPath = filePaths.createProjectPermissionsPath(projectId);
  const contents = [userId];
  return fileSystem.fileWrite(projectPermissionsPath, contents);
};

export const checkProjectAccess = (projectId, userId, projectMustExist = false) => {
  const projectPermissionsPath = filePaths.createProjectPermissionsPath(projectId);
  return fileSystem.fileRead(projectPermissionsPath)
    .then(contents => contents.indexOf(userId) >= 0)
    .catch(err => {
      if (err === errorDoesNotExist && !projectMustExist) {
        return Promise.resolve(true);
      }
      return Promise.reject(err);
    });
};

export const permissionsMiddleware = (req, res, next) => {
  const { projectId, user } = req;

  if (!user) {
    console.error('no user attached by auth middleware!');
    next('user not attached to request by middleware');
    return;
  }

  if (!user.uuid) next('no user.uuid present on request object');
  if (!projectId) next('projectId not found on route request');

  checkProjectAccess(projectId, user.uuid)
    .then(() => next())
    .catch((err) => {
      console.log('error checking project access', err);
      res.status(403).send(`User ${user.email} does not have access to project ${projectId}`);
    });
};
