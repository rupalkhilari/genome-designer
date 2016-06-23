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
