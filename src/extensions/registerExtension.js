import registry, { validRegion, addExtensionToRegistry } from './clientRegistry';

const registerExtension = (manifest, render) => {
  const { region } = manifest;

  if (validRegion(region)) {
    addExtensionToRegistry(region, manifest, render);
  } else {
    throw new Error(`extension region ${region} unrecognized`);
  }
};

export default registerExtension;