let lastAction;

export const getLastAction = () => {
  return lastAction;
};

export const saveLastActionMiddleware = (config) => ({getState, dispatch}) => (next) => (action) => {
  lastAction = action;
  return next(action);
};

export default saveLastActionMiddleware;
