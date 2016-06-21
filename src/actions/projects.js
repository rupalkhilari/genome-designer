import invariant from 'invariant';
import * as ActionTypes from '../constants/ActionTypes';
import { saveProject, loadProject, snapshot, listProjects, deleteProject } from '../middleware/data';
import * as projectSelectors from '../selectors/projects';
import * as undoActions from '../store/undo/actions';
import { push } from 'react-router-redux';

import * as instanceMap from '../store/instanceMap';
import Block from '../models/Block';
import Project from '../models/Project';
import { pauseAction, resumeAction } from '../store/pausableStore';

import { getItem, setItem } from '../middleware/localStorageCache';
const recentProjectKey = 'mostRecentProject';

const rollupDefined = (roll) => roll && roll.project && roll.blocks;

//Promise
export const projectList = () => {
  return (dispatch, getState) => {
    return listProjects()
      .then(projectManifests => {
        const projects = projectManifests.map(manifest => new Project(manifest));

        dispatch({
          type: ActionTypes.PROJECT_LIST,
          projects,
        });

        return projects;
      });
  };
};

//Promise
export const projectDelete = (projectId) => {
  return (dispatch, getState) => {
    return deleteProject(projectId)
      .then(() => {
        //don't delete the blocks, as they may be shared between projects (or, could delete and then force loading for next / current project)
        dispatch({
          type: ActionTypes.PROJECT_DELETE,
          projectId,
        });
        return projectId;
      });
  };
};

//Promise
//this is a background save (e.g. autosave)
export const projectSave = (inputProjectId, forceSave = false) => {
  return (dispatch, getState) => {
    const currentProjectId = dispatch(projectSelectors.projectGetCurrentId());
    const projectId = !!inputProjectId ? inputProjectId : currentProjectId;
    if (!projectId) {
      return Promise.resolve(null);
    }

    const roll = dispatch(projectSelectors.projectCreateRollup(projectId));
    if (!rollupDefined(roll)) {
      return Promise.reject('attempting to save project which is not loaded');
    }

    //check if project is new, and save only if it is (or forcing the save)
    if (!instanceMap.isRollupNew(roll) && forceSave !== true) {
      return Promise.resolve(null);
    }

    instanceMap.saveRollup(roll);

    return saveProject(projectId, roll)
      .then(commitInfo => {
        setItem(recentProjectKey, projectId);

        //if no version => first time saving, show a grunt
        if (!roll.project.version) {
          dispatch({
            type: ActionTypes.UI_SET_GRUNT,
            gruntMessage: 'Project Saved. Changes will continue to be saved automatically as you work.',
          });
        }

        const { sha, time } = commitInfo;
        dispatch({
          type: ActionTypes.PROJECT_SAVE,
          projectId,
          sha,
          time,
        });
        return sha;
      });
  };
};

//Promise
//explicit save e.g. an important point
export const projectSnapshot = (projectId, message, withRollup = true) => {
  return (dispatch, getState) => {
    const roll = withRollup ?
      dispatch(projectSelectors.projectCreateRollup(projectId)) :
    {};

    if (withRollup) {
      if (rollupDefined(roll)) {
        instanceMap.saveRollup(roll);
      } else {
        return Promise.reject('attempting to save project which is not loaded');
      }
    }

    return snapshot(projectId, message, roll)
      .then(commitInfo => {
        if (!commitInfo) {
          return null;
        }

        const { sha } = commitInfo;
        dispatch({
          type: ActionTypes.PROJECT_SNAPSHOT,
          projectId,
          sha,
        });
        return sha;
      });
  };
};

//Promise
export const projectLoad = (projectId, avoidCache = false) => {
  return (dispatch, getState) => {
    const isCached = instanceMap.projectLoaded(projectId);
    const promise = (avoidCache !== true && isCached)
      ?
      Promise.resolve(instanceMap.getRollup(projectId))
      :
      loadProject(projectId)
        .then(rollup => {
          const { project, blocks } = rollup;
          const projectModel = new Project(project);
          const blockMap = Object.keys(blocks)
            .map(blockId => blocks[blockId])
            .map((blockObject) => new Block(blockObject))
            .reduce((acc, block) => Object.assign(acc, { [block.id]: block }), {});

          return {
            project: projectModel,
            blocks: blockMap,
          };
        });

    //rollup by this point has been converted to class instances
    return promise.then((rollup) => {
      instanceMap.saveRollup(rollup);

      dispatch(pauseAction());
      dispatch(undoActions.transact());

      dispatch({
        type: ActionTypes.BLOCK_STASH,
        blocks: Object.keys(rollup.blocks).map(blockId => rollup.blocks[blockId]),
      });

      dispatch({
        type: ActionTypes.PROJECT_LOAD,
        project: rollup.project,
      });

      dispatch(undoActions.commit());
      dispatch(resumeAction());

      return rollup.project;
    });
  };
};

//Promise
//default to most recent project if falsy
//skip save if project is deleted
export const projectOpen = (inputProjectId, skipSave = false) => {
  return (dispatch, getState) => {
    const currentProjectId = dispatch(projectSelectors.projectGetCurrentId());
    const projectId = inputProjectId || getItem(recentProjectKey);

    if (!!currentProjectId && currentProjectId === projectId) {
      return Promise.resolve();
    }

    const promise = (skipSave === true)
      ?
      Promise.resolve()
      :
      dispatch(projectSave(currentProjectId))
        .catch(err => {
          if (currentProjectId) {
            dispatch({
              type: ActionTypes.UI_SET_GRUNT,
              gruntMessage: `Project ${currentProjectId} couldn't be saved, but navigating anyway...`,
            });
          }
        });

    return promise.then(() => {
      /*
       future - clear the store of blocks from the old project.
       need to consider blocks in the inventory - loaded projects, search results, shown in onion etc. Probably means committing to using the instanceMap for mapping state to props in inventory.

       const blockIds = dispatch(projectSelectors.projectListAllBlocks(currentProjectId)).map(block => block.id);

       // pause action e.g. so dont get accidental redraws with blocks missing
       dispatch(pauseAction());

       //remove prior projects blocks from the store
       dispatch({
       type: ActionTypes.BLOCK_DETACH,
       blockIds,
       });

       //projectPage will load the project + its blocks
       //change the route
       dispatch(push(`/project/${projectId}`));

       //dispatch(resumeAction());
       */

      //projectPage will load the project + its blocks
      //change the route
      dispatch(push(`/project/${projectId}`));
    });
  };
};

//create a new project
export const projectCreate = (initialModel) => {
  return (dispatch, getState) => {
    const project = new Project(initialModel);
    dispatch({
      type: ActionTypes.PROJECT_CREATE,
      project,
    });

    //after we've created it, let's save it real quick so it persists + gets a version
    //we can do this in the background
    projectSave(project.id);

    return project;
  };
};

//this is a backup for performing arbitrary mutations
export const projectMerge = (projectId, toMerge) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.merge(toMerge);
    dispatch({
      type: ActionTypes.PROJECT_MERGE,
      undoable: true,
      project,
    });
    return project;
  };
};

export const projectRename = (projectId, newName) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.mutate('metadata.name', newName);
    dispatch({
      type: ActionTypes.PROJECT_RENAME,
      undoable: true,
      project,
    });
    return project;
  };
};

//Adds a construct to a project. Does not create the construct. Use blocks.js
export const projectAddConstruct = (projectId, componentId, forceProjectId = false) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const component = getState().blocks[componentId];

    const componentProjectId = component.projectId;

    dispatch(pauseAction());
    dispatch(undoActions.transact());

    if (componentProjectId !== projectId) {
      invariant(!componentProjectId || forceProjectId === true, 'cannot add component with different projectId! set forceProjectId = true to overwrite.');

      const updatedComponent = component.setProjectId(projectId);
      dispatch({
        type: ActionTypes.BLOCK_STASH,
        block: updatedComponent,
      });
    }

    //todo - should better check + force removal from previous component / project
    //would want to check across other projects as well (but you would for constructs too)

    const project = oldProject.addComponents(componentId);
    dispatch({
      type: ActionTypes.PROJECT_ADD_CONSTRUCT,
      undoable: true,
      project,
    });

    dispatch(undoActions.commit());
    dispatch(resumeAction());

    return project;
  };
};

//Removes a construct from a project.
export const projectRemoveConstruct = (projectId, componentId) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.removeComponents(componentId);
    dispatch({
      type: ActionTypes.PROJECT_REMOVE_CONSTRUCT,
      undoable: true,
      project,
    });
    return project;
  };
};
