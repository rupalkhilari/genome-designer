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
/**
 * Given positional possiblities, generate combinations deterministically
 *
 * @param combos {2D Array} Positional options, e.g. [ [1,2,3], [4,5,6], [7] ]
 * @param collector {Array} Array to push permutations into
 * @param position
 * @param currentPermutation
 */

export default function saveCombinations(combos, collector, position = 0, currentPermutation = []) {
  const options = combos[position];
  for (let index = 0; index < options.length; index++) {
    currentPermutation[position] = options[index]; //just re-assign so dont bash memory to bits

    if (position === combos.length - 1) {
      collector.push(currentPermutation.slice());
    } else {
      saveCombinations(combos, collector, position + 1, currentPermutation);
    }
  }
}
