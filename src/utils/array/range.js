/**
 * Creates an n-length array whose values are numeric indices
 * @param n
 * @returns {Array<number>} array with n elements, where each element is its index
 */
export default function range (n) {
  //Function treats holes as undefined, while Array.map skips uninitialized values
  let arr = Array.apply(null, new Array(n));
  return arr.map(function (x, i) { return i });
}
