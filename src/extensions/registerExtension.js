import registry, { register, validRegion } from './clientRegistry';
import merge from 'lodash.merge';
import invariant from 'invariant';

const registerExtension = (manifest, render) => {
  const { name, region } = manifest;
  invariant(name, 'Name is required');
  invariant(region, 'Region (manifest.region) is required to register a plugin');
  invariant(typeof render === 'function', 'Must provide a render function to register a plugin');

  if (validRegion(region)) {
    const merged = merge({}, registry[name], manifest, {render});
    register(merged);
    return merged;
  } else {
    throw new Error(`extension region ${region} unrecognized`);
  }
};

export default registerExtension;
