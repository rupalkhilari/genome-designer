import * as regions from '../../server/extensions/regions';

export const registry = Object.keys(regions).reduce((acc, region) => {
  return Object.assign(acc, {[region] : {}});
}, {});

export const registerExtension = (manifest, render) => {
  const { id, region } = manifest;
  const registryType = registry[region];

  if (registry.hasOwnProperty(registryType)) {
    registryType[id] = Object.assign({}, manifest, {render});
  } else {
    throw new Error(`extension region ${region} unrecognized`);
  }
};
