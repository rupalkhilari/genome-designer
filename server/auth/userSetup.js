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

import * as querying from '../data/querying';
import onboardNewUser from './onboardNewUser';

const ensureUserSetup = (user) => {
  return querying.listProjectsWithAccess(user.uuid)
    .then(projects => {
      if (!projects.length) {
        //todo - get user.config from somewhere once using it
        return onboardNewUser(user, user.config)
          .then(rollup => rollup.project.id);
      }
      return projects[0].id;
    });
};

export default ensureUserSetup;
