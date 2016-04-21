/**
 * A ∪ B
 */
export function union(setA, setB) {
  return new Set(...setA, ...setB);
};
/**
 * A ∩ B
 */
export function intersection(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
};
/**
 * a \ b
 */
export function difference(setA, setB) {
  return new Set([...setA].filter(x => !setB.has(x)));
};
