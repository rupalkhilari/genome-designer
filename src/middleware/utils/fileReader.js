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
import invariant from 'invariant';

export default function readFileText(file) {
  invariant(file && file.name, 'expected a file object of the type that can be added to FormData');

  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (evt) => resolve(evt.target.result);
    fr.readAsText(file);
  });
}
