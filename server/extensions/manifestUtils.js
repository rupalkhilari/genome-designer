import invariant from 'invariant';

/**
 * Check whether an extension manifest has client side components
 * @private
 * @param manifest
 * @returns {boolean} true if client components
 */
export function manifestIsClient(manifest) {
  invariant(typeof manifest.geneticConstructor === 'object', 'must pass a valid genetic constructor manifest');
  const hasRegion = (manifest.geneticConstructor.region === null || !!manifest.geneticConstructor.region);
  return hasRegion;
}

/**
 * Check whether an extension manifest has server side components
 * @private
 * @param manifest
 * @returns {boolean} true if server components
 */
export function manifestIsServer(manifest) {
  invariant(typeof manifest.geneticConstructor === 'object', 'must pass a valid genetic constructor manifest');
  return !!manifest.geneticConstructor.router;
}

export function extensionName(manifest) {
  return manifest.geneticConstructor.readable || manifest.name;
}

export function extensionAuthor(manifest) {
  return manifest.author || 'Unknown';
}

export function extensionDescription(manifest) {
  return manifest.geneticConstructor.description || manifest.description || 'No Description';
}

export function extensionType(manifest) {
  return manifest.geneticConstructor.type || '';
}

export function extensionRegion(manifest) {
  return manifest.geneticConstructor.region;
}
