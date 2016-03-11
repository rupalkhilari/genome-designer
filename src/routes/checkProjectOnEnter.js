import { projectLoad } from '../actions/projects';

export default function checkProjectOnEnter(nextState, replace, callback, dispatch, getState) {
  const { projectId } = nextState.params;

  //hack - timeout so that the store is set up and can call orchestrator actions
  setTimeout(() => {
    const { projects } = getState();

    const promise = !projects[projectId] ?
      dispatch(projectLoad(projectId)) :
      Promise.resolve();

    promise
      .then(() => callback())
      .catch(err => replace());
  });
}
