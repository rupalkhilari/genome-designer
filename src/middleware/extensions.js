import rejectingFetch from './rejectingFetch';
import { headersGet } from './headers';
import { extensionsPath } from './paths';

export const getExtensionsInfo = () => {
  return rejectingFetch(extensionsPath('list'), headersGet())
    .then(resp => resp.json());
};
