let lastAction;

export const getLastAction = () => {
  return lastAction;
};

export default function saveLastActionMiddleware({dispatch, getState}) {
  return next => action => {
    lastAction = action;
    return next(action);
  };
}
