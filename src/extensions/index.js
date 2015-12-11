export const registry = {
  sequenceDetail: [],
};

export const registerExtension = (type, manifest) => {
  const registryType = registry[type];
  if (Array.isArray(registryType)) {
    registryType.push(manifest);
  } else {
    throw new Error(`extension type ${type} unrecognized`);
  }
};
