import invariant from 'invariant';

/**
 * Check whether an extension manifest has client side components. Does not validate their format.
 * @private
 * @param manifest
 * @returns {boolean} true if client components
 */
export function manifestIsClient(manifest) {
  invariant(typeof manifest === 'object', 'must pass manifest to clientCheck');
  invariant(typeof manifest.geneticConstructor === 'object', 'must pass a valid genetic constructor manifest');

  //check for old format
  if (typeof manifest.geneticConstructor.client === 'string' || typeof manifest.geneticConstructor.region === 'string') {
    console.error('extension in wrong format. Manifest should list array of client modules, not a single one. Check docs.');
  }

  if (!Array.isArray(manifest.geneticConstructor.client)) {
    return false;
  }

  const first = manifest.geneticConstructor.client[0];

  return typeof first.file === 'string' && (first.region === null || typeof first.region === 'string');
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

export function manifestClientFiles(manifest) {
  invariant(manifestIsClient(manifest), 'must pass client manifest');
  return manifest.geneticConstructor.client.map(clientObj => clientObj.file);
}

export function manifestClientRegions(manifest) {
  invariant(manifestIsClient(manifest), 'must pass client manifest');
  return manifest.geneticConstructor.client.map(clientObj => clientObj.region);
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
