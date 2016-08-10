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
Registration + onboarding for new users.

Handle the root /register route, which:
- takes in their user preferences, allowing referrers to send a configuration for new user defaults
- delegates to auth/register, to register the user
- saves that configuration at auth/update-all
- onboards the user according to their configuration

*/

// root /register handler
export default function (req, res, next) {
  //todo
}