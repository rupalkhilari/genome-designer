/*
 Copyright 2016 Autodesk,Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
/*
 This file creates starting content for users

 NOTE - create instances using Block.classless and Project.classless - the server is expect JSON blobs that it can assign to, and instances of classes are frozen.
 */
import invariant from 'invariant';
import { pickBy } from 'lodash';

import onboardingDefaults from './onboardingDefauts';
import * as rollup from '../data/rollup';

import makeEgfRollup from '../../data/egf_templates/index';
import emptyProjectWithConstruct from '../../data/emptyProject/index';

//while we are using imports, do this statically. todo - use require() for dynamic (will need to reconcile with build eventually, but whatever)
const projectMap = {
  egf_templates: () => makeEgfRollup(),
  emptyProject: () => emptyProjectWithConstruct(true),
};

//create rollups, where first is the one to return as final project ID
const generateInitialProjects = (config, user) => {
  const projects = Object.keys(config.projects)
    .map(projectKey => ({
      id: projectKey,
      ...config.projects[projectKey],
    }))
    .filter(projectInfo => projectInfo.access === true)
    .sort((one, two) => one.default ? -1 : 1);

  invariant(projects.length >= 1, 'must have some default projects, got none. check config for user ' + user.uuid);

  return config.projects.reduce((acc, projectConfig) => {
    const gen = projectMap[projectConfig.id];
    if (gen) {
      acc.push(gen(projectConfig));
    }
    return acc;
  }, []);
};

//create the EGF project + empty project for them
export default function onboardNewUser(user, inputConfig) {
  //todo - merge deeply, or shallow assign? For now, merge so have to for
  const config = Object.assign({}, onboardingDefaults, inputConfig);

  const initialProjects = generateInitialProjects(config, user);
  const [firstRoll, ...restRolls] = initialProjects;

  console.log(`[User Setup] Generated ${initialProjects.length} projects for user ${user.uuid}:
${initialProjects.map(roll => `${roll.project.name || 'Unnamed'} @ ${roll.project.id}`).join(', ')}`);

  return Promise.all(
    restRolls.map(roll => rollup.writeProjectRollup(roll.project.id, roll, user.uuid))
  )
    .then(() => rollup.writeProjectRollup(firstRoll.project.id, firstRoll, user.uuid));
}

