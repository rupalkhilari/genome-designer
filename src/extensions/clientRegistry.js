import * as regions from './../../server/extensions/regions';

const registry = Object.keys(regions).reduce((acc, region) => {
  return Object.assign(acc, {[region] : {}});
}, {});

export const validRegion = (region) => registry.hasOwnProperty(region);

export const addExtension = (region, manifest, render) => {
  const merged = Object.assign({}, manifest, {render});
  Object.assign(registry[region], {
    [manifest.name] : merged,
  });
  return merged;
};

export default registry;
