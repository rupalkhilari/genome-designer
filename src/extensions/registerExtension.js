import registry, { validRegion, addExtensionToRegistry } from './clientRegistry';
import invariant from 'invariant';

const registerExtension = (manifest, render) => {
  const { region } = manifest;
  invariant(region, 'Region (manifest.region) is required to register a plugin');

  if (validRegion(region)) {
    addExtensionToRegistry(region, manifest, render);
    return manifest;
  } else {
    throw new Error(`extension region ${region} unrecognized`);
  }
};

export default registerExtension;
