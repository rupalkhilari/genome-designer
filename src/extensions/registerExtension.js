import registry, { validRegion, addExtension } from './clientRegistry';

const registerExtension = (manifest, render) => {
  const { region } = manifest;

  if (validRegion(region)) {
    addExtension(region, manifest, render);
  } else {
    throw new Error(`extension region ${region} unrecognized`);
  }
};

export default registerExtension;