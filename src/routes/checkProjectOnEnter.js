import { projectLoad } from '../actions/projects';

export default function checkProjectOnEnter(nextState, replace, callback, dispatch, getState) {
  const { projectId } = nextState.params;

  // hack - timeout so that the store is set up.
  // If request route directly, this is called synchronously before the store has finished setting up.
  setTimeout(() => {
    const { projects } = getState();

    console.log(projects);

    const promise = !projects[projectId] ?
      dispatch(projectLoad(projectId)) :
      Promise.resolve();

    promise
      .then(() => callback())
      .catch(err => replace());
  });
}
